# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-11-13

Initial release.

- Plane Radar Lovelace card: sweeping green-phosphor canvas renderer with
  rotating beam + afterglow, range rings, degree rim, CRT scanlines/vignette
- Location: Home Assistant home zone (fallback: system location) or manual lat/long
- Sweep-revealed blips with per-aircraft details on click
- Visual card editor; range/rings/interval/sweep/units configurable
- Plane Radar integration: authenticated caching proxy to adsb.lol / adsb.fi
  (browser CORS is not available on those APIs), auto-registration of the card
  bundle as a Lovelace resource on storage-mode dashboards
