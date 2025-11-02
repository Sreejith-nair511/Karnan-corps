import os
from minio import Minio
from minio.error import S3Error
from app.core.config import settings

class MinIOService:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=False  # Set to True if using HTTPS
        )
        self.bucket_name = settings.MINIO_BUCKET
        
        # Create bucket if it doesn't exist
        self._create_bucket()
    
    def _create_bucket(self):
        """Create bucket if it doesn't exist."""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
        except S3Error as e:
            print(f"Error creating bucket: {e}")
    
    async def upload_file(self, file_path: str, object_name: str) -> str:
        """
        Upload a file to MinIO.
        
        Args:
            file_path: Path to the local file
            object_name: Name of the object in MinIO
            
        Returns:
            URL to the uploaded object
        """
        try:
            # Upload the file
            self.client.fput_object(
                self.bucket_name, object_name, file_path
            )
            
            # Return the URL
            url = f"http://{settings.MINIO_ENDPOINT}/{self.bucket_name}/{object_name}"
            return url
        except S3Error as e:
            print(f"Error uploading file: {e}")
            raise
    
    async def download_file(self, object_name: str, file_path: str) -> bool:
        """
        Download a file from MinIO.
        
        Args:
            object_name: Name of the object in MinIO
            file_path: Path to save the downloaded file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Download the file
            self.client.fget_object(
                self.bucket_name, object_name, file_path
            )
            return True
        except S3Error as e:
            print(f"Error downloading file: {e}")
            return False

# Global instance
minio_service = MinIOService()