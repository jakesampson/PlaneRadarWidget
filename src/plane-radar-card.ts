import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { RadarRenderer } from './radar-renderer';
import { cardStyles } from './styles';
import { fetchAircraft, MAX_RANGE_NM, MIN_RANGE_NM, PROVIDER_INFO } from './providers';
import { formatDistance, nmToUnit, unitToNm } from './geo';
import {
  formatAltitude,
  formatHeading,
  formatSpeed,
  formatTime,
  formatVerticalRate,
} from './format';
import type {
  Aircraft,
  DistanceUnit,
  HomeAssistant,
  PlaneRadarCardConfig,
  ProviderId,
  ResolvedLocation,
} from './types';

const CARD_VERSION = '1.0.0';
const DEFAULTS = {
  title: 'AIRSPACE RADAR',
  location_mode: 'ha' as const,
  provider: 'adsb.lol' as ProviderId,
  range: 50,
  rings: 4,
  update_interval: 10,
  sweep_duration: 6,
  distance_unit: 'nm' as const,
  trail_seconds: 60,
  height: 360,
  show_labels: true,
};

@customElement('plane-radar-card')
export class PlaneRadarCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PlaneRadarCardConfig;
  @state() private _aircraft: Aircraft[] = [];
  @state() private _selected: Aircraft | null = null;
  @state() private _error: string | null = null;
  @state() private _lastUpdated: Date | null = null;

  private _renderer: RadarRenderer | null = null;
  private _pollTimer: number | null = null;
  private _fetching = false;
  private _hassNudged = false;
  private _lastCenterKey: string | null = null;

  public setConfig(config: PlaneRadarCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }
    const merged: PlaneRadarCardConfig = { ...DEFAULTS, ...config };

    if (merged.location_mode === 'manual') {
      const { latitude, longitude } = merged;
      if (
        typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180
      ) {
        throw new Error('Manual location mode requires a valid "latitude" (-90..90) and "longitude" (-180..180)');
      }
    }

    const unit =
      merged.distance_unit === 'km' || merged.distance_unit === 'mi' ? merged.distance_unit : 'nm';
    merged.distance_unit = unit;

    // `range` is expressed in the selected unit; `range_nm` is the legacy
    // nautical-mile option and is still honoured for existing dashboards.
    let rangeNm: number;
    if (typeof config.range === 'number' && Number.isFinite(config.range)) {
      rangeNm = unitToNm(config.range, unit);
    } else if (typeof config.range_nm === 'number' && Number.isFinite(config.range_nm)) {
      rangeNm = config.range_nm;
    } else {
      rangeNm = unitToNm(DEFAULTS.range, unit);
    }
    merged.range_nm = clamp(rangeNm, MIN_RANGE_NM, MAX_RANGE_NM);
    merged.range = Math.round(nmToUnit(merged.range_nm, unit) * 10) / 10;

    merged.rings = clamp(Math.round(merged.rings ?? DEFAULTS.rings), 1, 8);
    merged.update_interval = clamp(merged.update_interval ?? DEFAULTS.update_interval, 5, 300);
    merged.sweep_duration = clamp(merged.sweep_duration ?? DEFAULTS.sweep_duration, 2, 20);
    merged.trail_seconds = clamp(Math.round(merged.trail_seconds ?? DEFAULTS.trail_seconds), 0, 300);
    merged.height = clamp(Math.round(merged.height ?? DEFAULTS.height), 0, 1200);

    this._config = merged;
    this._applyRendererOptions();
    this._restartPolling();
  }

  public getCardSize(): number {
    const height = this._config?.height ?? DEFAULTS.height;
    if (!height) return 7;
    // Header + footer chrome is roughly 80px; masonry units are 50px.
    return Math.max(2, Math.ceil((height + 80) / 50));
  }

  public static getStubConfig() {
    return {
      location_mode: 'ha',
      range: 50,
      distance_unit: 'nm',
      rings: 4,
      provider: 'adsb.lol',
      height: 360,
    };
  }

  public static getConfigElement() {
    return document.createElement('plane-radar-card-editor');
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._ensureRenderer();
    this._restartPolling();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopPolling();
    this._renderer?.destroy();
    this._renderer = null;
    // A fresh renderer starts with an empty track history.
    this._lastCenterKey = null;
  }

  protected firstUpdated(): void {
    this._ensureRenderer();
    this._restartPolling();
  }

  protected updated(): void {
    // Recreate the canvas renderer if the element was detached and re-attached
    // (e.g. navigating between dashboard views).
    this._ensureRenderer();
    this._applyRendererOptions();
    // Fetch promptly once the hass object is available, instead of waiting
    // for the first poll tick (up to update_interval seconds).
    if (this.hass && !this._hassNudged && !this._lastUpdated && !this._fetching) {
      this._hassNudged = true;
      this._poll();
    }
  }

  private _ensureRenderer(): void {
    if (this._renderer) return;
    const canvas = this.renderRoot.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) return;
    this._renderer = new RadarRenderer(canvas);
    this._applyRendererOptions();
    this._renderer.setAircraft(this._aircraft);
    this._renderer.start();
  }

  private _applyRendererOptions(): void {
    if (!this._renderer || !this._config) return;
    this._renderer.setOptions({
      rangeNm: this._config.range_nm!,
      rings: this._config.rings!,
      sweepDurationSec: this._config.sweep_duration!,
      distanceUnit: this._config.distance_unit ?? 'nm',
      showLabels: this._config.show_labels ?? true,
      selectedId: this._selected?.id ?? null,
      trailSeconds: this._config.trail_seconds ?? 60,
    });
  }

  private _resolveLocation(): ResolvedLocation | null {
    const cfg = this._config;
    if (!cfg) return null;

    if (cfg.location_mode === 'manual') {
      return { latitude: cfg.latitude!, longitude: cfg.longitude!, source: 'manual' };
    }

    // Prefer the Home Assistant home zone (user-configurable, includes radius)
    const zone = this.hass?.states?.['zone.home'];
    const zLat = zone?.attributes?.['latitude'];
    const zLon = zone?.attributes?.['longitude'];
    if (typeof zLat === 'number' && typeof zLon === 'number') {
      return { latitude: zLat, longitude: zLon, source: 'zone.home' };
    }

    const cLat = this.hass?.config?.latitude;
    const cLon = this.hass?.config?.longitude;
    if (typeof cLat === 'number' && typeof cLon === 'number') {
      return { latitude: cLat, longitude: cLon, source: 'hass.config' };
    }

    return null;
  }

  private _restartPolling(): void {
    this._stopPolling();
    if (!this.isConnected || !this._config) return;
    this._poll();
    this._pollTimer = window.setInterval(() => this._poll(), this._config.update_interval! * 1000);
  }

  private _stopPolling(): void {
    if (this._pollTimer !== null) {
      window.clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  private async _poll(): Promise<void> {
    const cfg = this._config;
    if (!cfg || this._fetching) return;
    const location = this._resolveLocation();
    if (!location || !this.hass) return; // notice is rendered instead

    // A moved radar centre invalidates all polar track history.
    const centerKey = `${location.latitude.toFixed(5)},${location.longitude.toFixed(5)}`;
    if (this._lastCenterKey !== null && this._lastCenterKey !== centerKey) {
      this._renderer?.clearHistory();
    }
    this._lastCenterKey = centerKey;

    this._fetching = true;
    try {
      const aircraft = await fetchAircraft(
        this.hass,
        cfg.provider ?? 'adsb.lol',
        location.latitude,
        location.longitude,
        cfg.range_nm!,
        cfg.api_url,
      );
      this._aircraft = aircraft;
      this._renderer?.setAircraft(aircraft);
      this._lastUpdated = new Date();
      this._error = null;
      // Keep the selection in sync with fresh data
      if (this._selected) {
        const fresh = aircraft.find((a) => a.id === this._selected!.id);
        this._selected = fresh ?? null;
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._fetching = false;
    }
  }

  private _onCanvasClick(event: MouseEvent): void {
    if (!this._renderer) return;
    const canvas = event.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const hit = this._renderer.hitTest(event.clientX - rect.left, event.clientY - rect.top);
    this._selected = hit && hit.id !== this._selected?.id ? hit : null;
    this._applyRendererOptions();
  }

  protected render() {
    if (!this._config) return nothing;
    const cfg = this._config;
    const location = this._resolveLocation();
    const unit = cfg.distance_unit ?? 'nm';
    const provider = PROVIDER_INFO[cfg.provider ?? 'adsb.lol'];
    const inRange = this._aircraft.filter((a) => a.distanceNm <= cfg.range_nm!).length;

    return html`
      <ha-card>
        <div class="header">
          <div class="title">${cfg.title}</div>
          <div class="contacts">${inRange} CONTACT${inRange === 1 ? '' : 'S'}</div>
        </div>
        <div class="radar-wrap" style=${cfg.height ? `--radar-h: ${cfg.height}px` : ''}>
          <canvas @click=${this._onCanvasClick}></canvas>
          <div class="scanlines"></div>
          <div class="vignette"></div>
          ${location === null
            ? html`
                <div class="notice">
                  <div>⚠ NO RADAR POSITION</div>
                  <div>
                    ${cfg.location_mode === 'manual'
                      ? 'Set a valid latitude and longitude in the card configuration.'
                      : html`Home location unavailable. Set <code>location_mode: manual</code> with
                          <code>latitude</code> and <code>longitude</code>, or enable the Home location zone in Home Assistant.`}
                  </div>
                </div>`
            : nothing}
          ${this._selected ? this._renderDetails(this._selected, unit) : nothing}
        </div>
        <div class="footer">
          <span class="seg">SRC ${provider.name.toUpperCase()} · RNG ${formatDistance(cfg.range_nm!, unit)}</span>
          <span class="seg">
            ${location
              ? `${location.latitude.toFixed(3)}° / ${location.longitude.toFixed(3)}° · ${location.source.toUpperCase()}`
              : 'NO POSITION'}
          </span>
          <span class="seg ${this._error ? 'error' : ''}">
            ${this._error
              ? 'LINK LOST – RETRYING'
              : this._lastUpdated
                ? `UPDATED ${formatTime(this._lastUpdated)}`
                : 'ACQUIRING…'}
          </span>
        </div>
      </ha-card>
    `;
  }

  private _renderDetails(ac: Aircraft, unit: DistanceUnit) {
    const fields: Array<[string, string]> = [
      ['Altitude', formatAltitude(ac.altitudeFt, ac.onGround)],
      ['Ground speed', formatSpeed(ac.speedKt)],
      ['Track', formatHeading(ac.headingDeg)],
      ['Vert. rate', formatVerticalRate(ac.verticalRateFpm)],
      ['Distance', formatDistance(ac.distanceNm, unit)],
      ['Bearing', `${String(Math.round(ac.bearingDeg)).padStart(3, '0')}°`],
      ['Squawk', ac.squawk ?? '—'],
      ['RSSI', ac.rssi !== null ? `${ac.rssi.toFixed(1)} dBFS` : '—'],
    ];
    return html`
      <div class="details" @click=${(e: Event) => e.stopPropagation()}>
        <div class="details-head">
          <div>
            <span class="callsign">${ac.callsign}</span>
            ${ac.typeCode ? html`<span class="type">${ac.typeCode}</span>` : nothing}
          </div>
          <button class="close" @click=${() => { this._selected = null; this._applyRendererOptions(); }}>
            CLOSE
          </button>
        </div>
        <div class="grid">
          ${fields.map(
            ([label, value]) => html`
              <div class="field">
                <label>${label}</label>
                <span>${value}</span>
              </div>`,
          )}
        </div>
      </div>
    `;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Editor is imported after the class so getConfigElement can instantiate it.
import './plane-radar-editor';

(window as unknown as { customCards?: unknown[] }).customCards ??= [];
(window as unknown as { customCards: Array<Record<string, string>> }).customCards.push({
  type: 'plane-radar-card',
  name: 'Plane Radar Card',
  description: 'Military-style sweeping ADS-B radar of the aircraft around your home.',
  preview: 'false',
});

// eslint-disable-next-line no-console
console.info(`%c PLANE-RADAR-CARD %c v${CARD_VERSION} `, 'background:#04281a;color:#2bffa0;font-weight:bold', 'background:#2bffa0;color:#04281a;font-weight:bold');
