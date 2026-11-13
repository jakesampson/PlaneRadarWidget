/**
 * Shared types for the Plane Radar card.
 */

/** Minimal shape of the Home Assistant object handed to Lovelace cards. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config?: {
    latitude?: number;
    longitude?: number;
    elevation?: number;
    unit_system?: { length?: string; [key: string]: unknown };
    time_zone?: string;
    [key: string]: unknown;
  };
  language?: string;
  /** Same-origin call to Home Assistant's REST API; adds auth automatically. */
  callApi(method: string, path: string): Promise<unknown>;
  [key: string]: unknown;
}

export type LocationMode = 'ha' | 'manual';
export type ProviderId = 'adsb.lol' | 'adsb.fi';
export type DistanceUnit = 'nm' | 'mi' | 'km';

export interface PlaneRadarCardConfig {
  type: string;
  /** Card title shown in the header. */
  title?: string;
  /** Where the radar is centered. "ha" = Home Assistant home zone / location, "manual" = lat/long below. */
  location_mode?: LocationMode;
  latitude?: number;
  longitude?: number;
  /** ADS-B aggregator relayed by the integration (both free, no key). */
  provider?: ProviderId;
  /** Optional override: custom proxy endpoint (advanced; replaces the integration). */
  api_url?: string;
  /** Radar radius expressed in `distance_unit` (5–250 nm equivalent). */
  range?: number;
  /** @deprecated Legacy radius in nautical miles. Prefer `range` + `distance_unit`. */
  range_nm?: number;
  /** Number of range rings to draw. */
  rings?: number;
  /** Seconds between aircraft polls (min 5). */
  update_interval?: number;
  /** Seconds per full radar sweep revolution. */
  sweep_duration?: number;
  /** Unit used for the range setting, ring labels and distance readouts. */
  distance_unit?: DistanceUnit;
  /** Seconds of historical track to draw behind each aircraft (0 disables). */
  trail_seconds?: number;
  /** Show callsign labels next to blips. */
  show_labels?: boolean;
}

export interface Aircraft {
  /** ADS-B hex identifier (stable per aircraft). */
  id: string;
  callsign: string;
  /** Aircraft type code, e.g. "B738". */
  typeCode: string | null;
  /** Barometric altitude in feet, null when on the ground or unknown. */
  altitudeFt: number | null;
  onGround: boolean;
  /** Ground speed in knots. */
  speedKt: number | null;
  /** Track / heading in degrees (0 = north, clockwise). */
  headingDeg: number | null;
  lat: number;
  lon: number;
  /** Feet per minute, +ve = climbing. */
  verticalRateFpm: number | null;
  squawk: string | null;
  /** Signal strength in dBFS (lower is weaker), if reported. */
  rssi: number | null;
  /** Computed: distance from radar center, nautical miles. */
  distanceNm: number;
  /** Computed: bearing from radar center, degrees (0 = north, clockwise). */
  bearingDeg: number;
}

export interface ResolvedLocation {
  latitude: number;
  longitude: number;
  /** Human-readable source, e.g. "zone.home", "hass.config" or "manual". */
  source: string;
}
