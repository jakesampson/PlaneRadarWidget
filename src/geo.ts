/** Great-circle helpers. Distances are in nautical miles. */

const EARTH_RADIUS_NM = 3440.065;

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

export const NM_PER_KM = 0.539957;

export function nmToKm(nm: number): number {
  return nm / NM_PER_KM;
}

/** Format a distance for display in the configured unit. */
export function formatDistance(nm: number, unit: 'nm' | 'km'): string {
  if (unit === 'km') {
    const km = nmToKm(nm);
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  }
  return nm < 10 ? `${nm.toFixed(1)} nm` : `${Math.round(nm)} nm`;
}
