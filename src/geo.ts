/** Great-circle helpers and distance-unit conversions. */

import type { DistanceUnit } from './types';

const EARTH_RADIUS_NM = 3440.065;

/** Nautical miles per kilometre (1 nm = 1.852 km). */
export const NM_PER_KM = 0.539957;
/** Nautical miles per statute mile (1 nm = 1.15078 mi). */
export const NM_PER_MI = 0.868976;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function haversineNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * EARTH_RADIUS_NM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Initial bearing from point 1 to point 2, degrees, 0 = north, clockwise. */
export function bearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function nmToKm(nm: number): number {
  return nm / NM_PER_KM;
}

export function kmToNm(km: number): number {
  return km * NM_PER_KM;
}

export function nmToMi(nm: number): number {
  return nm / NM_PER_MI;
}

export function miToNm(mi: number): number {
  return mi * NM_PER_MI;
}

/** Convert a distance expressed in `unit` into nautical miles. */
export function unitToNm(value: number, unit: DistanceUnit): number {
  if (unit === 'km') return kmToNm(value);
  if (unit === 'mi') return miToNm(value);
  return value;
}

/** Convert nautical miles into the given display unit. */
export function nmToUnit(nm: number, unit: DistanceUnit): number {
  if (unit === 'km') return nmToKm(nm);
  if (unit === 'mi') return nmToMi(nm);
  return nm;
}

/** Format a distance for display in the configured unit. */
export function formatDistance(nm: number, unit: DistanceUnit): string {
  const value = nmToUnit(nm, unit);
  const suffix = unit === 'km' ? 'km' : unit === 'mi' ? 'mi' : 'nm';
  return value < 10 ? `${value.toFixed(1)} ${suffix}` : `${Math.round(value)} ${suffix}`;
}
