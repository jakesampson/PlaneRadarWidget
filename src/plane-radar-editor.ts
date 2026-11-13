import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { nmToUnit, unitToNm } from './geo';
import type { DistanceUnit, HomeAssistant, PlaneRadarCardConfig } from './types';

const LABELS: Record<string, string> = {
  title: 'Title',
  location_mode: 'Radar position',
  latitude: 'Latitude',
  longitude: 'Longitude',
  provider: 'Data provider (via Plane Radar integration)',
  api_url: 'API base URL override (advanced)',
  distance_unit: 'Distance unit (range, rings & details)',
  range: 'Range',
  rings: 'Range rings',
  update_interval: 'Update interval (seconds)',
  sweep_duration: 'Sweep duration (seconds / revolution)',
  trail_seconds: 'Historical track (seconds)',
  height: 'Radar height (px, 0 = fit card width)',
  show_labels: 'Show callsign labels',
};

/** Slider bounds for the radar range, expressed in each supported unit. */
const RANGE_BOUNDS: Record<DistanceUnit, { min: number; max: number; step: number }> = {
  nm: { min: 5, max: 250, step: 5 },
  mi: { min: 6, max: 290, step: 5 },
  km: { min: 10, max: 465, step: 10 },
};

const DEFAULT_RANGE = 50;

function roundValue(value: number): number {
  return Math.round(value * 10) / 10;
}

@customElement('plane-radar-card-editor')
export class PlaneRadarCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PlaneRadarCardConfig;

  public setConfig(config: PlaneRadarCardConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name;

  private _currentUnit(): DistanceUnit {
    const unit = this._config?.distance_unit;
    return unit === 'km' || unit === 'mi' ? unit : 'nm';
  }

  private _valueChanged(event: CustomEvent): void {
    const value = (event.detail as { value: PlaneRadarCardConfig }).value;
    const config: PlaneRadarCardConfig = { ...value };
    const previousUnit = this._currentUnit();
    const nextUnit: DistanceUnit =
      config.distance_unit === 'km' || config.distance_unit === 'mi' ? config.distance_unit : 'nm';

    // Preserve the physical radar range when the user switches units, so
    // 50 nm becomes ~93 km rather than suddenly meaning 50 km.
    if (nextUnit !== previousUnit) {
      const currentRange =
        typeof config.range === 'number'
          ? config.range
          : typeof config.range_nm === 'number'
            ? nmToUnit(config.range_nm, previousUnit)
            : DEFAULT_RANGE;
      config.range = roundValue(nmToUnit(unitToNm(currentRange, previousUnit), nextUnit));
    }
    config.distance_unit = nextUnit;

    // Migrate the legacy `range_nm` option to `range` + `distance_unit`.
    if (typeof config.range !== 'number' && typeof config.range_nm === 'number') {
      config.range = roundValue(nmToUnit(config.range_nm, nextUnit));
    }
    delete config.range_nm;

    this._config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }),
    );
  }

  private _schema() {
    const manual = this._config?.location_mode === 'manual';
    const unit = this._currentUnit();
    const bounds = RANGE_BOUNDS[unit];
    const s: unknown[] = [
      { name: 'title', selector: { text: {} } },
      {
        name: 'location_mode',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'ha', label: 'Home Assistant home location' },
              { value: 'manual', label: 'Manual latitude / longitude' },
            ],
          },
        },
      },
    ];
    if (manual) {
      s.push(
        { name: 'latitude', selector: { number: { min: -90, max: 90, step: 0.0001, mode: 'box' } } },
        { name: 'longitude', selector: { number: { min: -180, max: 180, step: 0.0001, mode: 'box' } } },
      );
    }
    s.push(
      {
        name: 'provider',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'adsb.lol', label: 'adsb.lol (free, no key)' },
              { value: 'adsb.fi', label: 'adsb.fi (free, personal/non-commercial)' },
            ],
          },
        },
      },
      {
        name: 'distance_unit',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'nm', label: 'Nautical miles (nm)' },
              { value: 'mi', label: 'Miles (mi)' },
              { value: 'km', label: 'Kilometers (km)' },
            ],
          },
        },
      },
      {
        name: 'range',
        selector: {
          number: { min: bounds.min, max: bounds.max, step: bounds.step, mode: 'slider' },
        },
      },
      { name: 'rings', selector: { number: { min: 1, max: 8, step: 1, mode: 'slider' } } },
      { name: 'update_interval', selector: { number: { min: 5, max: 300, step: 5, mode: 'slider' } } },
      { name: 'sweep_duration', selector: { number: { min: 2, max: 20, step: 0.5, mode: 'slider' } } },
      { name: 'trail_seconds', selector: { number: { min: 0, max: 300, step: 10, mode: 'slider' } } },
      { name: 'height', selector: { number: { min: 0, max: 800, step: 20, mode: 'slider' } } },
      { name: 'show_labels', selector: { boolean: {} } },
      { name: 'api_url', selector: { text: { type: 'url', placeholder: 'https://my-proxy.example.com/aircraft' } } },
    );
    return s;
  }

  protected render() {
    if (!this._config) return nothing;
    const cfg = this._config;
    const unit = this._currentUnit();
    const range =
      typeof cfg.range === 'number'
        ? cfg.range
        : typeof cfg.range_nm === 'number'
          ? roundValue(nmToUnit(cfg.range_nm, unit))
          : DEFAULT_RANGE;

    const data = {
      update_interval: 10,
      sweep_duration: 6,
      rings: 4,
      trail_seconds: 60,
      height: 360,
      provider: 'adsb.lol',
      location_mode: 'ha',
      show_labels: true,
      ...cfg,
      distance_unit: unit,
      range,
    };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p style="font-size: 12px; opacity: 0.7; margin: 8px 4px 0;">
        “Home Assistant home location” uses <code>zone.home</code> (falling back to the system
        location from your HA configuration). Manual mode lets you point the radar at any
        coordinates. The distance unit applies to the range setting, ring labels and flight
        details. Historical tracks show the last <code>trail_seconds</code> (0 disables them)
        and reset whenever the card is reloaded. <code>height</code> caps the radar scope
        height so the card stays compact on wide dashboards — set it to 0 to size the scope
        from the card width instead. By default aircraft data is relayed by the
        <b>Plane Radar integration</b> (required). <code>api_url</code> is an advanced override
        for a custom compatible proxy — it receives
        <code>?lat=&amp;lon=&amp;radius=&amp;provider=</code> and must return readsb-style
        <code>{ ac: [...] }</code> JSON.
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plane-radar-card-editor': PlaneRadarCardEditor;
  }
}
