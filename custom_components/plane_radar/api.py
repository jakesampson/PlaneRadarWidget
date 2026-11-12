"""HTTP endpoints for the Plane Radar integration."""

from __future__ import annotations

import os
from typing import Any

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant, callback

from .const import (
    DEFAULT_PROVIDER,
    DOMAIN,
    MAX_RANGE_NM,
    MIN_RANGE_NM,
    PROVIDERS,
)
from .proxy import UpstreamError, async_fetch_aircraft


class PlaneRadarAircraftView(HomeAssistantView):
    """Authenticated proxy: GET /api/plane_radar/aircraft?lat=&lon=&radius=&provider="""

    url = "/api/plane_radar/aircraft"
    name = "api:plane_radar:aircraft"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def get(self, request: web.Request) -> web.Response:
        query = request.query

        try:
            lat = float(query.get("lat", ""))
            lon = float(query.get("lon", ""))
        except ValueError:
            return self._json_error("lat and lon must be numbers", status=400)

        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            return self._json_error("lat/lon out of range", status=400)

        try:
            radius = int(float(query.get("radius", str(50))))
        except ValueError:
            return self._json_error("radius must be a number", status=400)
        radius = max(MIN_RANGE_NM, min(MAX_RANGE_NM, radius))

        provider = query.get("provider", DEFAULT_PROVIDER)
        if provider not in PROVIDERS:
            return self._json_error(
                f"unknown provider '{provider}' (expected one of: {', '.join(PROVIDERS)})",
                status=400,
            )

        try:
            data = await async_fetch_aircraft(self.hass, provider, lat, lon, radius)
        except UpstreamError as err:
            return self._json_error(str(err), status=502)

        return web.json_response(
            data, headers={"Cache-Control": "no-store"}
        )

    @staticmethod
    def _json_error(message: str, status: int) -> web.Response:
        return web.json_response({"error": message}, status=status)


class PlaneRadarCardView(HomeAssistantView):
    """Public static bundle: GET /api/plane_radar/plane-radar-card.js

    Serves the card's built JavaScript so users only need to add a single
    dashboard resource — no file copying, no HACS frontend setup. Public by
    design: it is a static asset and must load in a <script type="module">
    tag, which cannot send the HA auth header.
    """

    url = "/api/plane_radar/plane-radar-card.js"
    name = "api:plane_radar:card"
    requires_auth = False

    @callback
    def __init__(self, hass: HomeAssistant) -> None:
        self._bundle = os.path.join(os.path.dirname(__file__), "static", "plane-radar-card.js")

    async def get(self, request: web.Request) -> web.Response:
        try:
            with open(self._bundle, "rb") as handle:
                body = handle.read()
        except OSError:
            return web.Response(
                text="plane-radar-card.js bundle missing — reinstall the integration or rebuild the frontend",
                status=404,
                content_type="text/plain",
            )
        return web.Response(
            body=body,
            content_type="application/javascript",
            headers={"Cache-Control": "public, max-age=3600"},
        )
