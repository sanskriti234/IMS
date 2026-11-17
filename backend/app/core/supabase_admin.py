
import os
from typing import Any

import httpx


import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

# Load backend/.env before reading environment variables.
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_FILE, override=False)


class SupabaseAdminError(Exception):
    pass


class SupabaseAdmin:
    def __init__(self) -> None:
        self.url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.service_role_key = os.getenv(
            "SUPABASE_SERVICE_ROLE_KEY", ""
        )

        if not self.url or not self.service_role_key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY "
                f"must be configured. Checked: {ENV_FILE}"
            )

    def _headers(self) -> dict[str, str]:
        return {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Content-Type": "application/json",
        }

    async def create_user(
        self,
        email: str,
        password: str,
        full_name: str,
    ) -> dict[str, Any]:
        url = f"{self.url}/auth/v1/admin/users"

        payload = {
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": full_name,
            },
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                url,
                headers=self._headers(),
                json=payload,
            )

        if response.status_code not in (200, 201):
            raise SupabaseAdminError(
                f"HTTP {response.status_code}: {response.text}"
            )

        data = response.json()

        if not data.get("id"):
            raise SupabaseAdminError(
                "Supabase did not return a user ID."
            )

        return data

    async def delete_user(self, user_id: str) -> None:
        url = f"{self.url}/auth/v1/admin/users/{user_id}"

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.delete(
                url,
                headers=self._headers(),
            )

        if response.status_code not in (200, 204):
            raise SupabaseAdminError(
                f"Supabase user cleanup failed: {response.text}"
            )


supabase_admin = SupabaseAdmin()



class SupabaseAdmin:
    def __init__(self) -> None:
        self.url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

        if not self.url or not self.service_role_key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured."
            )

    def _headers(self) -> dict[str, str]:
        return {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Content-Type": "application/json",
        }

    async def create_user(
        self,
        email: str,
        password: str,
        full_name: str,
    ) -> dict[str, Any]:
        url = f"{self.url}/auth/v1/admin/users"

        payload = {
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": full_name,
            },
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                url,
                headers=self._headers(),
                json=payload,
            )

        if response.status_code not in (200, 201):
            raise SupabaseAdminError(
                f"Supabase user creation failed: {response.text}"
            )

        data = response.json()

        if not data.get("id"):
            raise SupabaseAdminError(
                "Supabase did not return a user ID."
            )

        return data

    async def delete_user(self, user_id: str) -> None:
        url = f"{self.url}/auth/v1/admin/users/{user_id}"

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.delete(
                url,
                headers=self._headers(),
            )

        if response.status_code not in (200, 204):
            raise SupabaseAdminError(
                f"Supabase user cleanup failed: {response.text}"
            )


supabase_admin = SupabaseAdmin()
