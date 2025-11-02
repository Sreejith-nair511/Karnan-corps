import os
import yaml
from typing import List
from typing import Any


class Settings:
    def __init__(self):
        self.PROJECT_NAME: str = "Karnan - Solar Verification Backend"
        self.API_V1_STR: str = "/api/v1"
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
        self.BACKEND_CORS_ORIGINS: List[str] = []
        
        # Database settings
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
        
        # Redis settings
        self.REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        
        # MinIO settings
        self.MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
        self.MINIO_ACCESS_KEY: str = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.MINIO_SECRET_KEY: str = os.getenv("MINIO_SECRET_KEY", "minioadmin")
        self.MINIO_BUCKET: str = os.getenv("MINIO_BUCKET", "karnan")
        
        # Model settings
        self.MODEL_TYPE: str = os.getenv("MODEL_TYPE", "mock")
        
        # Imagery settings
        self.SATELLITE_PROVIDER: str = os.getenv("SATELLITE_PROVIDER", "mock")
        self.BUFFER_RADIUS_M: int = int(os.getenv("BUFFER_RADIUS_M", "20"))
        self.IMAGE_MIN_RESOLUTION_PX: int = int(os.getenv("IMAGE_MIN_RESOLUTION_PX", "512"))
        
        # QC settings
        self.CONFIDENCE_THRESHOLD_VERIFIABLE: float = float(os.getenv("CONFIDENCE_THRESHOLD_VERIFIABLE", "0.7"))
        
        # Capacity settings
        self.AREA_WP_PER_M2: int = int(os.getenv("AREA_WP_PER_M2", "170"))
        
        # Reward settings
        self.BASE_STP_POINTS: int = int(os.getenv("BASE_STP_POINTS", "100"))


def load_config():
    config = Settings()
    
    # Try to load from config.yml
    config_path = "config.yml"
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            yaml_config = yaml.safe_load(f)
            
        # Override settings with values from YAML
        if yaml_config:
            for key, value in yaml_config.items():
                if hasattr(config, key.upper()):
                    setattr(config, key.upper(), value)
    
    return config


settings = load_config()