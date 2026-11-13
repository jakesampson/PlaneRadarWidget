"""Constants for the Plane Radar integration."""

import json
import os

DOMAIN = "plane_radar"

# Cache TTL (seconds) for upstream ADS-B responses, shared across all cards
# and clients to stay within the community APIs' fair-use limits.
CACHE_TTL = 10.0

# Upstream aggregators. Both are free, keyless and return readsb-style JSON
# with an `ac` array. adsb.fi is personal/non-commercial use only.
PROVIDERS: dict[str, str] = {
    "adsb.lol": "https://api.adsb.lol/v2/lat/{lat}/lon/{lon}/dist/{radius}",
    "adsb.fi": "https://opendata.adsb.fi/api/v3/lat/{lat}/lon/{lon}/dist/{radius}",
}
DEFAULT_PROVIDER = "adsb.lol"

MIN_RANGE_NM = 5
MAX_RANGE_NM = 250

# Frontend bundle: served at URL_BASE and auto-registered as a Lovelace
# resource (storage-mode dashboards). Version is read from manifest.json so
# there is a single source of truth — bump it on each release.
with open(os.path.join(os.path.dirname(__file__), "manifest.json"), encoding="utf-8") as _f:
    VERSION = json.load(_f)["version"]

URL_BASE = "/plane_radar"
JSMODULES = [{"name": "Plane Radar Card", "filename": "plane-radar-card.js", "version": VERSION}]
