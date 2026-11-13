# ✈️ Plane Radar

A military-style, sweeping green-phosphor **radar** for your Home Assistant dashboard, showing live ADS-B aircraft traffic around your home — or anywhere you point it.

- 📡 **Live ADS-B data** relayed through the integration from free public aggregators ([adsb.lol](https://adsb.lol) or [adsb.fi](https://adsb.fi)) — no API key, no account
- 🏠 **Home Assistant home location** (`zone.home`, with fallback to your system location) or **manual latitude/longitude**
- 🟢 **Old-school CRT sweep** — rotating beam with phosphor afterglow, range rings, degree ticks, cardinal letters, scanlines and a vignette
- ✈️ **Blips light up as the sweep passes** and slowly fade; ground traffic shows as hollow amber squares
- 🧭 **Range in nautical miles, miles or kilometres** — one unit setting drives the range slider, ring labels and flight details
- 📝 **Permanent callsign labels** next to every in-range contact
- 🛤️ **One-minute historical tracks** behind each aircraft, reset when the card reloads
- 🎯 **Click any blip** for flight details: altitude, ground speed, track, vertical rate, distance, bearing, squawk, signal strength
- ⚙️ **Visual editor** — everything configurable from the UI, no YAML required

## Why there is a custom integration

The free ADS-B aggregators do not send CORS headers, so a purely client-side
card cannot call them from your browser. The **Plane Radar integration** is a
tiny authenticated, caching proxy inside Home Assistant: the card talks to
`/api/plane_radar/aircraft` on your own instance — fast, private, and within
upstream rate limits (responses are cached ~10 s and shared across all cards).

* `/plane_radar/plane-radar-card.js` — the Lovelace card bundle, served publicly and auto-registered as a Lovelace resource (storage-mode dashboards)
* `/api/plane_radar/aircraft` — an authenticated caching proxy to the free
  community ADS-B aggregators (browsers cannot call them directly due to
  missing CORS headers). The card calls Home Assistant's own API, same-origin,
  with your normal credentials.

---

## Installation

### 1. Install the integration via HACS

1. HACS → **Integrations → ⋮ → Custom repositories**
2. Add this repository, category **Integration**
3. Install **Plane Radar**, then **restart Home Assistant**

*(Manual install: copy `custom_components/plane_radar` into your HA config's `custom_components/` folder and restart.)*

### 2. Add the integration

**Settings → Devices & Services → Add Integration → Plane Radar** → confirm.
No options are required.

### 3. Card resource — nothing to do (usually)

If your dashboard is **storage-mode** (the default when you build dashboards in
the UI), the integration automatically registers the card as a Lovelace
resource — reload your browser and the **Plane Radar Card** shows up when
adding a card.

**YAML-mode dashboards** must add the resource manually:

```yaml
resources:
  - url: /plane_radar/plane-radar-card.js?v=0.2.0
    type: module
```

### 4. Add a card

Edit dashboard → **Add card → Plane Radar Card**, or via YAML:

```yaml
type: custom:plane-radar-card
title: AIRSPACE RADAR
location_mode: ha        # 'ha' = home zone / HA location, 'manual' = lat/long below
# latitude: 52.5200      # only for location_mode: manual
# longitude: 13.4050
provider: adsb.lol       # adsb.lol | adsb.fi
distance_unit: nm        # nm | mi | km — also sets the unit for `range`
range: 50                # radar radius in `distance_unit` (5–250 nm equivalent)
rings: 4                 # number of range rings (1–8)
update_interval: 10      # seconds between ADS-B polls (min 5)
sweep_duration: 6        # seconds per full 360° sweep
trail_seconds: 60        # historical track length in seconds (0 disables)
show_labels: true        # permanent callsign labels next to blips
```

### Options

| Option            | Type    | Default            | Description                                          |
|-------------------|---------|--------------------|------------------------------------------------------|
| `title`           | string  | `AIRSPACE RADAR`   | Header text                                          |
| `location_mode`   | string  | `ha`               | `ha` = Home Assistant location, `manual` = lat/long  |
| `latitude`        | number  | —                  | Manual mode: radar center latitude                   |
| `longitude`       | number  | —                  | Manual mode: radar center longitude                  |
| `provider`        | string  | `adsb.lol`         | `adsb.lol` or `adsb.fi`                              |
| `distance_unit`   | string  | `nm`               | Unit for range, rings and details: `nm`, `mi` or `km` |
| `range`           | number  | `50`               | Radar radius in `distance_unit` (max ~250 nm)        |
| `range_nm`        | number  | —                  | Legacy radius in nautical miles (use `range` instead) |
| `rings`           | number  | `4`                | Number of range rings                                |
| `update_interval` | number  | `10`               | Seconds between polls (5–300)                        |
| `sweep_duration`  | number  | `6`                | Seconds per sweep revolution                         |
| `trail_seconds`   | number  | `60`               | Historical track length in seconds (0–300, 0 = off)  |
| `show_labels`     | boolean | `true`             | Permanently show callsigns next to blips             |
| `api_url`         | string  | —                  | Advanced: override proxy URL (see below)             |

### Where does the location come from?

- **`ha`** → `zone.home` attributes (latitude/longitude). If the zone entity is
  missing, falls back to the system location from your Home Assistant
  configuration.
- **`manual`** → the `latitude`/`longitude` you set in the card.

### Aircraft data sources & fair use

Both aggregators are free community services run on donated feeders; be kind:
keep `update_interval` at 10 s or more. The integration caches upstream
responses for ~10 s, so multiple cards barely increase load.

- **adsb.lol** — open API, ~500 requests/day anonymous per IP, ODbL-licensed data.
- **adsb.fi** — free for personal, non-commercial use; rate-limited to 1 req/s.
  Not for commercial deployments. See <https://github.com/adsbfi/opendata>.

Aircraft data © the respective ADS-B communities. This project is not
affiliated with them.

### `api_url` (advanced)

If you run your own compatible proxy (e.g. in front of a local ADS-B receiver
or a hosted aggregator), set `api_url` to bypass the built-in integration.
It receives `?lat=&lon=&radius=&provider=` query parameters and must return
readsb-style `{ "ac": [ ... ] }` JSON.

## Development

```bash
npm install
npm run dev        # vite build --watch
npm run build      # production build → custom_components/plane_radar/static/
npm run typecheck  # strict TypeScript check
```

Layout:

| Path | Purpose |
|------|---------|
| `src/plane-radar-card.ts` | Card element: polling, location resolution, details panel |
| `src/radar-renderer.ts`   | Canvas renderer: sweep, rings, rim ticks, blips, ownship glyph |
| `src/providers.ts`        | Integration-proxied (or `api_url`) fetch + response normalization |
| `src/geo.ts`              | Haversine distance & bearing |
| `src/plane-radar-editor.ts` | Visual config editor (ha-form) |
| `custom_components/plane_radar/` | Python integration: authenticated proxy + card bundle host |
| `custom_components/plane_radar/static/plane-radar-card.js` | Built bundle (committed; do not edit by hand) |

### Releasing

Tag a version and push — the release workflow rebuilds the bundle and attaches
it to the GitHub release:

```bash
git tag v0.2.0 && git push --tags
```

## License

[MIT](LICENSE)
