"""Upstream ADS-B fetching with a shared in-memory cache."""

from __future__ import annotations

import asyncio
import time
from typing import Any

from aiohttp import ClientError, ClientTimeout

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CACHE_TTL, PROVIDERS

_TIMEOUT = ClientTimeout(total=12)


class UpstreamError(Exception):
    """Raised when the upstream ADS-B aggregator cannot be reached."""


def _cache_key(provider: str, lat: float, lon: float, radius: int) -> tuple:
    # Round coordinates so jitter in card requests still hits the cache.
    return (provider, round(lat, 2), round(lon, 2), int(radius))


async def async_fetch_aircraft(
    hass: HomeAssistant, provider: str, lat: float, lon: float, radius: int
) -> dict[str, Any]:
    """Fetch aircraft in range from the provider, using the shared cache."""
    if provider not in PROVIDERS:
        raise UpstreamError(f"Unknown provider: {provider}")

    store: dict[str, Any] = hass.data["plane_radar"].setdefault(
        "cache", {}
    )
    locks: dict[tuple, asyncio.Lock] = hass.data["plane_radar"].setdefault(
        "locks", {}
    )
    key = _cache_key(provider, lat, lon, radius)

    hit = store.get(key)
    if hit and (time.monotonic() - hit[0]) < CACHE_TTL:
        return hit[1]

    lock = locks.setdefault(key, asyncio.Lock())
    async with lock:
        # Re-check inside the lock: another request may have refreshed it.
        hit = store.get(key)
        if hit and (time.monotonic() - hit[0]) < CACHE_TTL:
            return hit[1]

        url = PROVIDERS[provider].format(lat=lat, lon=lon, radius=int(radius))
        session = async_get_clientsession(hass)
        try:
            async with session.get(url, timeout=_TIMEOUT) as response:
                if response.status != 200:
                    body = await response.text()
                    raise UpstreamError(
                        f"{provider} returned HTTP {response.status}: {body[:200]}"
                    )
                data = await response.json(content_type=None)
        except (ClientError, asyncio.TimeoutError) as err:
            raise UpstreamError(f"{provider} request failed: {err}") from err

        if not isinstance(data, dict):
            raise UpstreamError(f"{provider} returned an unexpected payload")

        store[key] = (time.monotonic(), data)
        return data
