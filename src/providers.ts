/**
 * Aircraft data is proxied through the Plane Radar custom integration
 * (`/api/plane_radar/aircraft`), which relays the free community ADS-B
 * aggregators server-side. That avoids browser CORS restrictions entirely
 * and lets the integration cache upstream responses to respect rate limits.
 *
 * Power users can bypass the integration by setting `api_url` in the card
 * config — a base URL receiving `?lat=&lon=&radius=&provider=` and returning
 * readsb-style `{ ac: [...] }` JSON.
 */

import { bearingDeg, haversineNm } from './geo';
import type { Aircraft, HomeAssistant, ProviderId } from './types';

export const MAX_RANGE_NM = 250;
export const MIN_RANGE_NM = 5;

export const PROVIDER_INFO: Record<ProviderId, { name: string; url: string }> = {
  'adsb.lol': { name: 'adsb.lol', url: 'https://adsb.lol' },
  'adsb.fi': { name: 'adsb.fi', url: 'https://adsb.fi' },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type RawAircraft = any;

function num(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function str(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function normalizeAircraft(raw: RawAircraft, centerLat: number, centerLon: number): Aircraft | null {
  const lat = num(raw?.lat);
  const lon = num(raw?.lon);
  if (lat === null || lon === null) return null; // position unknown — skip

  const hex = str(raw?.hex) ?? `${lat.toFixed(3)}:${lon.toFixed(3)}`;
  const flight = str(raw?.flight);

  // alt_baro is either a number (feet) or the string "ground".
  const altRaw = raw?.alt_baro;
  const onGround = typeof altRaw === 'string' && altRaw.toLowerCase() === 'ground';
  const altitudeFt = onGround ? null : num(altRaw) ?? num(raw?.alt_geom);

  const heading = num(raw?.track) ?? num(raw?.true_heading) ?? num(raw?.nav_heading) ?? num(raw?.mag_heading);

  return {
    id: hex,
    callsign: flight ?? hex.toUpperCase(),
    typeCode: str(raw?.t) ?? str(raw?.category),
    altitudeFt: altitudeFt !== null ? Math.round(altitudeFt) : null,
    onGround,
    speedKt: num(raw?.gs) ?? num(raw?.tas) ?? num(raw?.ias),
    headingDeg: heading !== null ? ((heading % 360) + 360) % 360 : null,
    lat,
    lon,
    verticalRateFpm: num(raw?.baro_rate) ?? num(raw?.vert_rate),
    squawk: str(raw?.squawk),
    rssi: num(raw?.rssi),
    distanceNm: haversineNm(centerLat, centerLon, lat, lon),
    bearingDeg: bearingDeg(centerLat, centerLon, lat, lon),
  };
}

function parseResponse(data: any): RawAircraft[] {
  if (data && typeof data.error === 'string') {
    throw new Error(data.error);
  }
  const list = Array.isArray(data?.ac) ? data.ac : [];
  return list;
}

export async function fetchAircraft(
  hass: HomeAssistant,
  provider: ProviderId,
  lat: number,
  lon: number,
  radiusNm: number,
  apiUrl?: string,
): Promise<Aircraft[]> {
  const radius = Math.min(MAX_RANGE_NM, Math.max(MIN_RANGE_NM, Math.round(radiusNm)));
  const query = `lat=${lat}&lon=${lon}&radius=${radius}&provider=${encodeURIComponent(provider)}`;

  let data: any;
  if (apiUrl) {
    const joiner = apiUrl.includes('?') ? '&' : '?';
    const response = await fetch(`${apiUrl}${joiner}${query}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      throw new Error(`${apiUrl} returned HTTP ${response.status}`);
    }
    data = await response.json();
  } else {
    data = await hass.callApi('GET', `plane_radar/aircraft?${query}`);
  }

  return parseResponse(data)
    .map((raw) => normalizeAircraft(raw, lat, lon))
    .filter((a): a is Aircraft => a !== null)
    .sort((a, b) => a.distanceNm - b.distanceNm);
}
