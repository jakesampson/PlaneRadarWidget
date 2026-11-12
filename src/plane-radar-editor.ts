import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, PlaneRadarCardConfig } from './types';

const LABELS: Record<string, string> = {
  title: 'Title',
  location_mode: 'Radar position',
  latitude: 'Latitude',
  longitude: 'Longitude',
  provider: 'Data provider (via Plane Radar integration)',
  api_url: 'API base URL override (advanced)',
  range_nm: 'Range (nautical miles)',
  rings: 'Range rings',
  update_interval: 'Update interval (seconds)',
  sweep_duration: 'Sweep duration (seconds / revolution)',
  distance_unit: 'Distance unit',
  show_labels: 'Show callsign labels',
};

@customElement('plane-radar-card-editor')
export class PlaneRadarCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PlaneRadarCardConfig;

  public setConfig(config: PlaneRadarCardConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name;

  private _valueChanged(event: CustomEvent): void {
    const config = (event.detail as { value: PlaneRadarCardConfig }).value;
    this._config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }),
    );
  }

  private _schema() {
    const manual = this._config?.location_mode === 'manual';
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
      { name: 'range_nm', selector: { number: { min: 5, max: 250, step: 5, mode: 'slider' } } },
      { name: 'rings', selector: { number: { min: 1, max: 8, step: 1, mode: 'slider' } } },
      { name: 'update_interval', selector: { number: { min: 5, max: 300, step: 5, mode: 'slider' } } },
      { name: 'sweep_duration', selector: { number: { min: 2, max: 20, step: 0.5, mode: 'slider' } } },
      {
        name: 'distance_unit',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'nm', label: 'Nautical miles (nm)' },
              { value: 'km', label: 'Kilometers (km)' },
            ],
          },
        },
      },
      { name: 'show_labels', selector: { boolean: {} } },
      { name: 'api_url', selector: { text: { type: 'url', placeholder: 'https://my-proxy.example.com/aircraft' } } },
    );
    return s;
  }

  protected render() {
    if (!this._config) return nothing;
    const data = {
      update_interval: 10,
      sweep_duration: 6,
      rings: 4,
      range_nm: 50,
      distance_unit: 'nm',
      provider: 'adsb.lol',
      location_mode: 'ha',
      show_labels: true,
      ...this._config,
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
        coordinates. By default aircraft data is relayed by the <b>Plane Radar integration</b>
        (required). <code>api_url</code> is an advanced override for a custom compatible proxy —
        it receives <code>?lat=&amp;lon=&amp;radius=&amp;provider=</code> and must return
        readsb-style <code>{ ac: [...] }</code> JSON.
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plane-radar-card-editor': PlaneRadarCardEditor;
  }
}
