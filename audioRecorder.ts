import { blobToBase64 } from "./storage.ts";

export interface PcmRecorderSession {
  stop: () => Promise<{ audioBase64: string; mimeType: "audio/wav" } | null>;
  cancel: () => void;
}

function downsampleTo16kHz(
  samples: Float32Array,
  inputRate: number
): Float32Array {
  const targetRate = 16000;
  if (inputRate === targetRate) return samples;
  const ratio = inputRate / targetRate;
  const newLength = Math.max(1, Math.floor(samples.length / ratio));
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const pos = i * ratio;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    const s0 = samples[idx] ?? 0;
    const s1 = samples[Math.min(idx + 1, samples.length - 1)] ?? s0;
    result[i] = s0 + (s1 - s0) * frac;
  }
  return result;
}

function encodeWavPcm16(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function mergeFloat32Chunks(chunks: Float32Array[]): Float32Array {
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

function hasAudibleSignal(samples: Float32Array): boolean {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > peak) peak = abs;
  }
  return peak > 0.0015;
}

export async function startPcmWavRecording(): Promise<PcmRecorderSession> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone recording is not supported in this browser.");
  }

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioCtx) {
    throw new Error("Web Audio recording is not supported in this browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  const audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  const sampleRate = audioCtx.sampleRate;
  const chunks: Float32Array[] = [];
  const source = audioCtx.createMediaStreamSource(stream);
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);
  const silentGain = audioCtx.createGain();
  silentGain.gain.value = 0;

  processor.onaudioprocess = (event) => {
    const channel = event.inputBuffer.getChannelData(0);
    if (channel && channel.length > 0) {
      chunks.push(new Float32Array(channel));
    }
  };

  source.connect(processor);
  processor.connect(silentGain);
  silentGain.connect(audioCtx.destination);

  const cleanup = () => {
    try {
      processor.disconnect();
      source.disconnect();
      silentGain.disconnect();
    } catch {
      // ignore disconnect errors
    }
    audioCtx.close().catch(() => {});
    stream.getTracks().forEach((tr) => tr.stop());
  };

  return {
    cancel: () => {
      chunks.length = 0;
      cleanup();
    },
    stop: async () => {
      const captured = chunks.slice();
      chunks.length = 0;
      cleanup();

      const merged = mergeFloat32Chunks(captured);
      const durationSec = merged.length / Math.max(1, sampleRate);
      if (durationSec < 0.2 || !hasAudibleSignal(merged)) {
        return null;
      }

      const pcm16k = downsampleTo16kHz(merged, sampleRate);
      const wavBlob = encodeWavPcm16(pcm16k, 16000);
      const audioBase64 = await blobToBase64(wavBlob);
      return { audioBase64, mimeType: "audio/wav" };
    },
  };
}
