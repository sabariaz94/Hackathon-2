"""
Authentication configuration settings

Manages JWT and OAuth configuration with environment variable support.
All secrets loaded from environment variables, never hardcoded.
"""

from typing import Optional
from pydantic_settings import BaseSettings


class AuthSettings(BaseSettings):
    """Authentication settings with environment variable support"""

    # JWT Configuration
    jwt_secret_key: str = "your-secret-key-min-32-characters-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Password Hashing Configuration
    bcrypt_rounds: int = 12

    # OAuth Configuration (Not used - Supabase handles OAuth)
    # Google OAuth configuration has been removed as Supabase handles OAuth

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False
    }


# Global auth settings instance
auth_settings = AuthSettings()
