"""Serves the card bundle over HTTP and auto-registers it as a Lovelace resource."""

from __future__ import annotations

import os

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from ..const import JSMODULES, URL_BASE

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")


async def async_register_static_path(hass: HomeAssistant) -> None:
    """Expose ``static/`` at URL_BASE (public — a <script> tag can't send auth)."""
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, STATIC_DIR, cache_headers=False)]
        )
    except RuntimeError:
        pass  # already registered (reload)


async def async_register_lovelace_cards(hass: HomeAssistant) -> None:
    """YAML-free installs: add/update the card as a Lovelace resource.

    Only works for storage-mode (UI-managed) Lovelace; YAML dashboards need
    the manual resource snippet from the README.
    """
    lovelace = hass.data.get("lovelace")
    mode = getattr(lovelace, "mode", None) or getattr(
        lovelace, "resource_mode", "yaml"
    )
    if mode != "storage":
        return

    # Lovelace loads its resources asynchronously; wait until they are ready.
    if not getattr(getattr(lovelace, "resources", None), "loaded", False):
        from homeassistant.helpers.event import async_call_later

        async def _retry(_now) -> None:
            await async_register_lovelace_cards(hass)

        async_call_later(hass, 5, _retry)
        return

    existing = [
        resource
        for resource in lovelace.resources.async_items()
        if resource["url"].startswith(URL_BASE)
    ]
    for module in JSMODULES:
        url = f"{URL_BASE}/{module['filename']}"
        version = module["version"]
        registered = False
        for resource in existing:
            if resource["url"].split("?")[0] == url:
                registered = True
                current = resource["url"].split("?v=")[1] if "?v=" in resource["url"] else "0"
                if current != version:
                    await lovelace.resources.async_update_item(
                        resource["id"],
                        {"res_type": "module", "url": f"{url}?v={version}"},
                    )
                break
        if not registered:
            await lovelace.resources.async_create_item(
                {"res_type": "module", "url": f"{url}?v={version}"}
            )
