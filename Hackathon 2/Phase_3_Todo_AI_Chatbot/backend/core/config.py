"""
Configuration settings for Todo API

Manages application configuration with environment variable support.
Settings can be overridden via .env file.
"""

import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    app_name: str = "Todo API"
    port: int = 8000
    log_level: str = "info"
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/tododb"

    # JWT Authentication Settings
    jwt_secret_key: str = (
        "489dc3d2df93f662a60c69849058e635f16a32f764893ca11a6ad7eea1794ee1"
    )
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Better Auth Settings
    better_auth_secret: str = os.getenv("BETTER_AUTH_SECRET", "default-secret-for-dev")

    # OpenRouter API Settings
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    agent_model: str = os.getenv("AGENT_MODEL", "openai/gpt-5.2-chat")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


# Global settings instance
settings = Settings()
