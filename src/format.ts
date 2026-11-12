/** Display formatting helpers for the flight details panel and footer. */

export function formatAltitude(ft: number | null, onGround: boolean): string {
  if (onGround) return 'GND';
  if (ft === null) return '—';
  return `${Math.round(ft).toLocaleString()} ft`;
}

export function formatSpeed(kt: number | null): string {
  if (kt === null) return '—';
  return `${Math.round(kt)} kt`;
}

export function formatHeading(deg: number | null): string {
  if (deg === null) return '—';
  return `${String(Math.round(deg)).padStart(3, '0')}°`;
}

export function formatVerticalRate(fpm: number | null): string {
  if (fpm === null) return '—';
  if (Math.abs(fpm) < 64) return `0 fpm`;
  const arrow = fpm > 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(Math.round(fpm))} fpm`;
}

export function formatDistance(nm: number, unit: 'nm' | 'km'): string {
  if (unit === 'km') {
    const km = nm * 1.852;
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  }
  return nm < 10 ? `${nm.toFixed(1)} nm` : `${Math.round(nm)} nm`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
