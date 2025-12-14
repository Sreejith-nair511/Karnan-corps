from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import uuid
import os
from app.models.schemas import SiteVerificationResponse
from app.services.solar_detection_service import detect_solar_panels

router = APIRouter()

@router.post("/detect", response_model=SiteVerificationResponse)
async def detect_solar_panels_endpoint(
    image: UploadFile = File(...),
    sample_id: str = Form(...),
    lat: float = Form(...),
    lon: float = Form(...),
    model_type: str = Form("mistral")  # Can be "mistral", "unet" or "yolov5"
):
    """
    Detect solar panels in an uploaded image using pretrained models.
    
    Args:
        image: Uploaded image file (JPG, PNG, GeoTIFF)
        sample_id: Unique identifier for the sample
        lat: Latitude coordinate
        lon: Longitude coordinate
        model_type: Type of model to use ("mistral", "unet" or "yolov5")
        
    Returns:
        SiteVerificationResponse with detection results
    """
    # Validate file type
    allowed_extensions = ["jpg", "jpeg", "png", "tiff", "tif"]
    file_extension = image.filename.split(".")[-1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPG, PNG, TIFF")
    
    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = f"data/temp/{unique_filename}"
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        content = await image.read()
        buffer.write(content)
    
    try:
        # Run solar panel detection
        result = await detect_solar_panels(
            file_path=file_path,
            sample_id=sample_id,
            lat=lat,
            lon=lon,
            model_type=model_type
        )
        return result
    except Exception as e:
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")