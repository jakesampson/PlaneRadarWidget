"""Plane Radar integration for Home Assistant.

Installs two things:

* ``/api/plane_radar/plane-radar-card.js`` — the Lovelace card bundle
* ``/api/plane_radar/aircraft`` — an authenticated caching proxy to the free
  community ADS-B aggregators (browsers cannot call them directly due to
  missing CORS headers)

The integration itself holds no state besides the response cache.
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .api import PlaneRadarAircraftView, PlaneRadarCardView
from .const import DOMAIN


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up integration-wide state (no YAML configuration supported)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register views once, regardless of how many times the entry is reloaded."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    domain_data.setdefault("cache", {})
    domain_data.setdefault("locks", {})

    if not domain_data.get("views_registered"):
        hass.http.register_view(PlaneRadarAircraftView(hass))
        hass.http.register_view(PlaneRadarCardView(hass))
        domain_data["views_registered"] = True

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload — views stay registered (HA has no view unregister), data is dropped."""
    domain_data = hass.data.get(DOMAIN)
    if domain_data is not None:
        domain_data["cache"] = {}
    return True
