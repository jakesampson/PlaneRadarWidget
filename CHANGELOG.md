# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2026-11-13

- Added a `height` option (default 360 px) that caps the radar scope height,
  so the card stays compact on wide dashboards instead of expanding to a
  full-width square. Set `height: 0` to restore the square-from-width
  behaviour
- The scope canvas stays square and centred inside a wider card, and the
  flight details panel matches its width
- `getCardSize()` now reflects the configured height

## [0.3.0] - 2026-11-13

- Aircraft positions now update only when the sweep passes over them. Polled
  data is held per contact and painted when the beam crosses its bearing, so
  the scope no longer jumps in unison every `update_interval` seconds
- New contacts stay hidden until the sweep first reveals them
- Historical track points are recorded at reveal time, keeping trails in sync
  with the displayed blip position
- Click hit-testing uses the position currently painted on the scope

## [0.2.0] - 2026-11-13

- Range can now be set in nautical miles, statute miles or kilometres; the
  chosen unit also drives ring labels, flight details and the footer readout
- Callsign labels are now permanent while an aircraft is in range instead of
  fading with the sweep afterglow
- Added one-minute historical tracks behind each aircraft (`trail_seconds`,
  0 disables). History is in-memory and resets on reload or when the radar
  centre moves
- Card renderer is recreated when the element is re-attached to the DOM, so
  the radar keeps animating after navigating between dashboard views
- `range_nm` is retained as a deprecated alias for `range` (nautical miles)

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
