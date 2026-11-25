import type { AppLanguage } from "../types.ts";

export interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  lastState: "inside" | "outside" | "unknown";
  createdAt: number;
}

export interface GeofenceAlertEvent {
  id: string;
  locationId: string;
  locationName: string;
  transition: "enter" | "exit";
  distanceMeters: number;
  timestamp: number;
  message: string;
}

export interface SensorLocationSnapshot {
  locationActive: boolean;
  locationPermission: "prompt" | "granted" | "denied" | "unsupported";
  locationError: string | null;
  coords: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    updatedAt: number;
  } | null;

  sensorsActive: boolean;
  proximity: {
    supported: boolean;
    near: boolean | null;
    distanceCm: number | null;
    maxRangeCm: number | null;
    note: string;
  };
  motion: {
    accelerometerSupported: boolean;
    gyroscopeSupported: boolean;
    state: "unknown" | "stationary" | "moving" | "shaking";
    accelerationMagnitude: number | null;
    rotationRateDegPerSec: number | null;
    lastMovedAt: number | null;
  };
  compass: {
    supported: boolean;
    headingDegrees: number | null;
    cardinal: string | null;
  };
  nearObject: {
    active: boolean;
    facingMode: "user" | "environment";
    state: "clear" | "motion_near" | "object_close";
    avgBrightness: number | null;
    motionPercent: number | null;
    lastIdentifiedObject: string | null;
    error: string | null;
  };
}

export type SensorQueryType =
  | "location"
  | "proximity"
  | "near_object_identify"
  | "motion"
  | "compass"
  | "geofence_enter_home"
  | "geofence_leave_here";

const SAVED_LOCATIONS_KEY = "ay_suleiman_saved_locations_v1";

export function createInitialSnapshot(): SensorLocationSnapshot {
  const hasGeo =
    typeof navigator !== "undefined" && "geolocation" in navigator;
  const hasOrientation =
    typeof window !== "undefined" && "DeviceOrientationEvent" in window;
  const hasMotion =
    typeof window !== "undefined" && "DeviceMotionEvent" in window;
  const hasProximity =
    typeof window !== "undefined" &&
    ("ProximitySensor" in window || "onuserproximity" in window);

  return {
    locationActive: false,
    locationPermission: hasGeo ? "prompt" : "unsupported",
    locationError: null,
    coords: null,

    sensorsActive: false,
    proximity: {
      supported: hasProximity,
      near: null,
      distanceCm: null,
      maxRangeCm: null,
      note: hasProximity
        ? "Activate sensors to read proximity."
        : "Browser does not expose hardware proximity sensor; available natively in the Android app.",
    },
    motion: {
      accelerometerSupported: hasMotion,
      gyroscopeSupported: hasMotion,
      state: "unknown",
      accelerationMagnitude: null,
      rotationRateDegPerSec: null,
      lastMovedAt: null,
    },
    compass: {
      supported: hasOrientation,
      headingDegrees: null,
      cardinal: null,
    },
    nearObject: {
      active: false,
      facingMode: "environment",
      state: "clear",
      avgBrightness: null,
      motionPercent: null,
      lastIdentifiedObject: null,
      error: null,
    },
  };
}

export function loadSavedLocations(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(SAVED_LOCATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedLocation =>
        Boolean(item) &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.lat === "number" &&
        typeof item.lng === "number"
    );
  } catch {
    return [];
  }
}

export function saveSavedLocations(locations: SavedLocation[]): void {
  try {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  } catch {
    // ignore storage errors
  }
}

export function calculateHaversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeBearingDegrees(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return ((toDeg(Math.atan2(y, x)) % 360) + 360) % 360;
}

export function degreesToCardinal(
  degrees: number,
  language: AppLanguage = "en"
): string {
  const norm = ((degrees % 360) + 360) % 360;
  const dirsEn = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];
  const dirsHa = [
    "Arewa",
    "Arewa maso Gabas",
    "Gabas",
    "Kudu maso Gabas",
    "Kudu",
    "Kudu maso Yamma",
    "Yamma",
    "Arewa maso Yamma",
  ];
  const idx = Math.round(norm / 45) % 8;
  return language === "ha" ? dirsHa[idx] : dirsEn[idx];
}

export function degreesToShortCardinal(degrees: number): string {
  const norm = ((degrees % 360) + 360) % 360;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(norm / 45) % 8];
}

export function classifyMotionState(
  linearAccelMag: number,
  rotationDegPerSec: number
): "stationary" | "moving" | "shaking" {
  if (linearAccelMag >= 8.5) return "shaking";
  if (linearAccelMag >= 0.85 || rotationDegPerSec >= 18) return "moving";
  return "stationary";
}

export function evaluateGeofences(
  lat: number,
  lng: number,
  locations: SavedLocation[],
  language: AppLanguage = "en"
): { updated: SavedLocation[]; events: GeofenceAlertEvent[] } {
  const events: GeofenceAlertEvent[] = [];
  const updated = locations.map((loc) => {
    const dist = calculateHaversineDistanceMeters(lat, lng, loc.lat, loc.lng);
    const nextState: "inside" | "outside" =
      dist <= loc.radiusMeters ? "inside" : "outside";

    if (loc.lastState === "outside" && nextState === "inside" && loc.alertOnEnter) {
      const msg =
        language === "ha"
          ? `Ka isa wurin da ka ajiye: ${loc.name}.`
          : language === "pcm"
          ? `You don reach your saved location: ${loc.name}.`
          : `You have arrived at your saved location: ${loc.name}.`;
      events.push({
        id: `${loc.id}-enter-${Date.now()}`,
        locationId: loc.id,
        locationName: loc.name,
        transition: "enter",
        distanceMeters: Math.round(dist),
        timestamp: Date.now(),
        message: msg,
      });
    } else if (
      loc.lastState === "inside" &&
      nextState === "outside" &&
      loc.alertOnExit
    ) {
      const msg =
        language === "ha"
          ? `Ka bar wurin da ka ajiye: ${loc.name}.`
          : language === "pcm"
          ? `You don comot from your saved location: ${loc.name}.`
          : `You have left your saved location: ${loc.name}.`;
      events.push({
        id: `${loc.id}-exit-${Date.now()}`,
        locationId: loc.id,
        locationName: loc.name,
        transition: "exit",
        distanceMeters: Math.round(dist),
        timestamp: Date.now(),
        message: msg,
      });
    }

    return { ...loc, lastState: nextState };
  });

  return { updated, events };
}

export function formatSensorVoiceResponse(
  queryType: SensorQueryType,
  snapshot: SensorLocationSnapshot,
  savedLocations: SavedLocation[],
  language: AppLanguage
): string {
  switch (queryType) {
    case "location": {
      if (!snapshot.coords) {
        if (snapshot.locationPermission === "denied") {
          return language === "ha"
            ? "An hana izinin wuri. Ka kunna izinin GPS a saitunan burauza."
            : language === "pcm"
            ? "Location permission no dey allow. Open settings allow GPS first."
            : "Location permission was denied. Allow location access in your browser settings and try again.";
        }
        return language === "ha"
          ? "Ba a kunna gano wuri ba tukuna ko ana jiran siginar GPS."
          : language === "pcm"
          ? "Location never turn on yet or GPS still dey find your spot."
          : "Location awareness is not active yet or is still waiting for a GPS fix.";
      }
      const { lat, lng, accuracyMeters } = snapshot.coords;
      let nearest: { loc: SavedLocation; dist: number; bearing: string } | null =
        null;
      for (const loc of savedLocations) {
        const dist = calculateHaversineDistanceMeters(lat, lng, loc.lat, loc.lng);
        if (!nearest || dist < nearest.dist) {
          const bearingDeg = computeBearingDegrees(lat, lng, loc.lat, loc.lng);
          nearest = {
            loc,
            dist,
            bearing: degreesToCardinal(bearingDeg, language),
          };
        }
      }
      const placeSuffix = nearest
        ? nearest.dist <= nearest.loc.radiusMeters
          ? ` Inside ${nearest.loc.name}.`
          : ` Nearest saved place is ${nearest.loc.name}, ${Math.round(nearest.dist)} meters ${nearest.bearing}.`
        : "";
      if (language === "ha") {
        return `An gano wurin da kake yanzu: latitude ${lat.toFixed(4)}, longitude ${lng.toFixed(4)}, kimanin mita ${Math.round(accuracyMeters)}.${nearest ? ` Wuri mafi kusa: ${nearest.loc.name} (${Math.round(nearest.dist)}m ${nearest.bearing}).` : ""}`;
      }
      if (language === "pcm") {
        return `Your current location don show: latitude ${lat.toFixed(4)}, longitude ${lng.toFixed(4)}, accuracy na ${Math.round(accuracyMeters)} meters.${nearest ? ` Nearest saved place na ${nearest.loc.name}, ${Math.round(nearest.dist)} meters ${nearest.bearing}.` : ""}`;
      }
      return `Your current location has been detected: latitude ${lat.toFixed(4)}, longitude ${lng.toFixed(4)}, accuracy within ${Math.round(accuracyMeters)} meters.${placeSuffix}`;
    }

    case "proximity":
    case "near_object_identify": {
      if (snapshot.proximity.supported && snapshot.sensorsActive && snapshot.proximity.near !== null) {
        if (snapshot.proximity.near) {
          return language === "ha"
            ? "Wani abu yana kusa da wayarka."
            : language === "pcm"
            ? "Something dey near your phone."
            : "An object is close to your phone.";
        }
      }

      if (snapshot.nearObject.active) {
        if (snapshot.nearObject.state === "object_close") {
          const extra = snapshot.nearObject.lastIdentifiedObject
            ? ` Looks like: ${snapshot.nearObject.lastIdentifiedObject}.`
            : "";
          return language === "ha"
            ? `Wani abu yana kusa sosai da wayarka.${extra}`
            : language === "pcm"
            ? `Something dey very close to your phone.${extra}`
            : `An object is very close to your phone.${extra}`;
        }
        if (snapshot.nearObject.state === "motion_near") {
          return language === "ha"
            ? "An gano motsi kusa da wayarka."
            : language === "pcm"
            ? "Something dey move near your phone."
            : "Movement detected near your phone.";
        }
        if (snapshot.nearObject.lastIdentifiedObject) {
          return snapshot.nearObject.lastIdentifiedObject;
        }
        return language === "ha"
          ? "Babu abin da ke kusa da wayarka a yanzu."
          : language === "pcm"
          ? "Nothing dey close to your phone right now."
          : "No close object detected in front of your phone right now.";
      }

      if (!snapshot.proximity.supported) {
        return language === "ha"
          ? "Kunna Near-Object Sensor a shafin Sensors don gano abubuwan da ke kusa da wayarka."
          : language === "pcm"
          ? "On Near-Object Sensor for Sensors screen so I fit tell you wetin dey near your phone."
          : "Turn on Near-Object Sensor in Sensors & Location so your phone can detect and tell you what is near it.";
      }
      return language === "ha"
        ? "Kunna na'urorin auna a shafin Sensors don duba kusanci."
        : language === "pcm"
        ? "On Sensors first make I check wetin dey near your phone."
        : "Please activate sensor monitoring first so I can check for near objects.";
    }

    case "motion": {
      if (!snapshot.sensorsActive || snapshot.motion.state === "unknown") {
        return language === "ha"
          ? "Kunna na'urorin auna don in duba ko kana motsi."
          : language === "pcm"
          ? "On sensor monitoring first make I know if you dey move."
          : "Motion sensors are not active yet. Enable sensor monitoring in Sensors & Location to check movement.";
      }
      if (snapshot.motion.state === "shaking") {
        return language === "ha"
          ? "Wayarka tana girgiza ko motsawa da ƙarfi yanzu."
          : language === "pcm"
          ? "Your phone dey shake well well right now."
          : "Your phone is currently shaking or moving rapidly.";
      }
      if (snapshot.motion.state === "moving") {
        return language === "ha"
          ? "Kana motsi a halin yanzu."
          : language === "pcm"
          ? "You dey move right now."
          : "You are currently moving.";
      }
      return language === "ha"
        ? "Kana tsaye cak, ba a gano motsi mai yawa ba."
        : language === "pcm"
        ? "You dey steady for one place right now."
        : "You appear to be stationary right now.";
    }

    case "compass": {
      if (
        !snapshot.sensorsActive ||
        snapshot.compass.headingDegrees === null
      ) {
        return language === "ha"
          ? "Ba a karanta kamfas ba tukuna. Kunna na'urorin auna a shafin Sensors."
          : language === "pcm"
          ? "Compass never read yet. On sensor monitoring for Sensors screen."
          : "Compass heading is not available yet. Enable sensor monitoring in Sensors & Location.";
      }
      const deg = Math.round(snapshot.compass.headingDegrees);
      const dir = degreesToCardinal(deg, language);
      if (language === "ha") {
        return `Kana fuskantar ${dir}, digiri ${deg}.`;
      }
      if (language === "pcm") {
        return `You dey face ${dir} at ${deg} degrees.`;
      }
      return `You are facing ${dir} at ${deg} degrees.`;
    }

    case "geofence_enter_home": {
      const home = savedLocations.find(
        (l) => l.name.toLowerCase() === "home"
      );
      if (!home) {
        return language === "ha"
          ? "Ba a ajiye wurin Gida tukuna ba. Buɗe Sensors & Location don ajiye Gida."
          : language === "pcm"
          ? "You never save Home location yet. Open Sensors & Location to save Home."
          : "No Home location is saved yet. Open Sensors & Location while at home to save it first.";
      }
      return language === "ha"
        ? "An saita sanarwar isa Gida."
        : language === "pcm"
        ? "I go alert you once you reach Home."
        : "Arrival alert is active for Home. I will notify you when you arrive.";
    }

    case "geofence_leave_here": {
      if (!snapshot.coords) {
        return language === "ha"
          ? "Ana buƙatar siginar GPS don saita sanarwar barin wannan wuri."
          : language === "pcm"
          ? "GPS location need to on before I fit alert you when you comot here."
          : "Enable Location Awareness first so I can save this spot and alert you when you leave.";
      }
      return language === "ha"
        ? "An ajiye wannan wuri kuma za a sanar da kai idan ka bar shi."
        : language === "pcm"
        ? "I don save dis spot and I go alert you when you comot."
        : "Saved your current spot and enabled exit alert. I will notify you when you leave this location.";
    }
  }
}
