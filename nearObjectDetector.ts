export type OpticalProximityState = "clear" | "motion_near" | "object_close";

export interface OpticalFrameMetrics {
  avgBrightness: number;
  centerBrightness: number;
  brightnessStdDev: number;
  motionPercent: number;
  state: OpticalProximityState;
}

/**
 * Pure frame-luminance analyzer for local, zero-API-cost optical proximity & near-object detection.
 * Works across mobile browsers/WebViews where hardware ProximitySensor is hidden.
 */
export function analyzeLumaFrame(
  currLuma: Uint8Array,
  prevLuma: Uint8Array | null,
  baselineBrightness: number | null
): OpticalFrameMetrics {
  const len = currLuma.length;
  if (len === 0) {
    return {
      avgBrightness: 0,
      centerBrightness: 0,
      brightnessStdDev: 0,
      motionPercent: 0,
      state: "clear",
    };
  }

  let sum = 0;
  let sqSum = 0;
  let changed = 0;

  for (let i = 0; i < len; i++) {
    const val = currLuma[i];
    sum += val;
    sqSum += val * val;
    if (prevLuma && prevLuma.length === len && Math.abs(val - prevLuma[i]) > 22) {
      changed++;
    }
  }

  const avgBrightness = sum / len;
  const variance = Math.max(0, sqSum / len - avgBrightness * avgBrightness);
  const brightnessStdDev = Math.sqrt(variance);
  const motionPercent = prevLuma ? (changed / len) * 100 : 0;

  const isOccludedDark = avgBrightness < 28 && brightnessStdDev < 22;
  const droppedFromBaseline =
    baselineBrightness !== null &&
    baselineBrightness > 45 &&
    avgBrightness < baselineBrightness * 0.42 &&
    brightnessStdDev < 28;

  let state: OpticalProximityState = "clear";
  if (isOccludedDark || droppedFromBaseline) {
    state = "object_close";
  } else if (motionPercent >= 12) {
    state = "motion_near";
  }

  return {
    avgBrightness,
    centerBrightness: avgBrightness,
    brightnessStdDev,
    motionPercent,
    state,
  };
}

export function extractLumaFromRgba(rgba: Uint8ClampedArray): Uint8Array {
  const pixelCount = Math.floor(rgba.length / 4);
  const out = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    out[i] = Math.round(
      0.299 * rgba[idx] + 0.587 * rgba[idx + 1] + 0.114 * rgba[idx + 2]
    );
  }
  return out;
}

export interface OpticalProximityController {
  stop: () => void;
  captureJpegBase64: () => string | null;
}

export async function startOpticalNearObjectMonitor(options: {
  facingMode: "user" | "environment";
  videoElement: HTMLVideoElement | null;
  onUpdate: (metrics: OpticalFrameMetrics) => void;
  onError: (message: string) => void;
}): Promise<OpticalProximityController | null> {
  if (!navigator.mediaDevices?.getUserMedia) {
    options.onError("Camera access is not supported in this browser.");
    return null;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: options.facingMode,
        width: { ideal: 320 },
        height: { ideal: 240 },
      },
    });
  } catch (err) {
    const name = err instanceof DOMException ? err.name : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      options.onError(
        "Camera permission was denied. Allow camera access in your browser settings to detect near objects."
      );
    } else {
      options.onError("Could not start optical near-object sensor camera.");
    }
    return null;
  }

  const hiddenVideo = options.videoElement || document.createElement("video");
  hiddenVideo.playsInline = true;
  hiddenVideo.muted = true;
  hiddenVideo.srcObject = stream;
  try {
    await hiddenVideo.play();
  } catch {
    // ignore autoplay quirks when muted
  }

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = 64;
  sampleCanvas.height = 48;
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = 480;
  captureCanvas.height = 360;
  const captureCtx = captureCanvas.getContext("2d");

  let prevLuma: Uint8Array | null = null;
  let baselineBrightness: number | null = null;
  let stopped = false;

  const timer = window.setInterval(() => {
    if (stopped || !sampleCtx || hiddenVideo.readyState < 2) return;
    sampleCtx.drawImage(hiddenVideo, 0, 0, sampleCanvas.width, sampleCanvas.height);
    const frame = sampleCtx.getImageData(
      0,
      0,
      sampleCanvas.width,
      sampleCanvas.height
    );
    const currLuma = extractLumaFromRgba(frame.data);
    const metrics = analyzeLumaFrame(currLuma, prevLuma, baselineBrightness);

    if (baselineBrightness === null && metrics.avgBrightness > 30) {
      baselineBrightness = metrics.avgBrightness;
    } else if (
      baselineBrightness !== null &&
      metrics.state === "clear" &&
      metrics.avgBrightness > 35
    ) {
      baselineBrightness = baselineBrightness * 0.92 + metrics.avgBrightness * 0.08;
    }

    prevLuma = currLuma;
    options.onUpdate(metrics);
  }, 350);

  return {
    stop: () => {
      stopped = true;
      window.clearInterval(timer);
      stream.getTracks().forEach((tr) => tr.stop());
      if (hiddenVideo.srcObject === stream) {
        hiddenVideo.srcObject = null;
      }
    },
    captureJpegBase64: () => {
      if (!captureCtx || hiddenVideo.readyState < 2) return null;
      const w = hiddenVideo.videoWidth || 480;
      const h = hiddenVideo.videoHeight || 360;
      captureCanvas.width = w;
      captureCanvas.height = h;
      captureCtx.drawImage(hiddenVideo, 0, 0, w, h);
      const dataUrl = captureCanvas.toDataURL("image/jpeg", 0.82);
      const idx = dataUrl.indexOf(",");
      return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
    },
  };
}
