"""
Configuration settings for Todo API

Manages application configuration with environment variable support.
Settings can be overridden via .env file.
"""

from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings with environment variable support"""

    app_name: str = "Todo API"
    port: int = 8000
    log_level: str = "info"
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/tododb"

    # JWT Authentication Settings
    jwt_secret_key: str = "your-secret-key-min-32-characters-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Better Auth Settings
    better_auth_secret: str = os.getenv("BETTER_AUTH_SECRET")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False
    }


# Global settings instance
settings = Settings()
