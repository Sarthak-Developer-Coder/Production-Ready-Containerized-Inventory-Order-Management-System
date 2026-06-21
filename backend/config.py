from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql://user:password@db:5432/inventory_db"
    secret_key: str = "your-secret-key-here"
    environment: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()
