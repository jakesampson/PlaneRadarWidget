"""Config flow: one-click setup, no options required."""

from __future__ import annotations

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class PlaneRadarConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Confirm the install; everything is configured on the dashboard card."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None) -> FlowResult:
        if user_input is not None:
            await self.async_set_unique_id(DOMAIN)
            self._abort_if_unique_id_configured()
            return self.async_create_entry(title="Plane Radar", data={})

        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))
