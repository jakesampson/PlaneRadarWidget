"""Plane Radar integration for Home Assistant.

Installs two things:

* ``/plane_radar/plane-radar-card.js`` — the Lovelace card bundle, served
  publicly and auto-registered as a Lovelace resource (storage-mode dashboards)
* ``/api/plane_radar/aircraft`` — an authenticated caching proxy to the free
  community ADS-B aggregators (browsers cannot call them directly due to
  missing CORS headers)

The integration itself holds no state besides the response cache.
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant, CoreState

from .api import PlaneRadarAircraftView
from .const import DOMAIN
from .frontend import async_register_lovelace_cards, async_register_static_path


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Serve the card bundle and (re)register it once HA has started."""
    hass.data.setdefault(DOMAIN, {})

    await async_register_static_path(hass)

    async def _register(_event=None) -> None:
        await async_register_lovelace_cards(hass)

    if hass.state == CoreState.running:
        await _register()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _register)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register the API view once, regardless of reload count."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    domain_data.setdefault("cache", {})
    domain_data.setdefault("locks", {})

    if not domain_data.get("views_registered"):
        hass.http.register_view(PlaneRadarAircraftView(hass))
        domain_data["views_registered"] = True

    # Make sure the card resource is registered even if the integration was
    # added after HA started.
    await async_register_lovelace_cards(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload — views stay registered (HA has no view unregister), data is dropped."""
    domain_data = hass.data.get(DOMAIN)
    if domain_data is not None:
        domain_data["cache"] = {}
    return True
