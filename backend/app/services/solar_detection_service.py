import os
import uuid
import torch
import numpy as np
from typing import Optional, Dict, Any
from PIL import Image
import torchvision.transforms as T
from datetime import datetime
from app.models.schemas import SiteVerificationResponse
import base64
import io

# Import models (these would be implemented in the models directory)
# For now, we'll use placeholder imports
try:
    # These imports will work once we add the models
    from models.unet_model import UNet
    from models.yolov5_model import YOLOv5
    MODEL_IMPORTS_AVAILABLE = True
except ImportError:
    # Fallback to mock implementation
    MODEL_IMPORTS_AVAILABLE = False
    print("Warning: Could not import solar panel detection models. Using mock implementation.")

# Try to import Mistral AI client
try:
    from mistralai.client import MistralClient
    from mistralai.models.chat_completion import ChatMessage
    MISTRAL_AVAILABLE = True
except ImportError:
    MISTRAL_AVAILABLE = False
    print("Warning: Mistral AI client not available. Using fallback detection methods.")

async def detect_solar_panels(
    file_path: str,
    sample_id: str,
    lat: float,
    lon: float,
    model_type: str = "unet"
) -> SiteVerificationResponse:
    """
    Detect solar panels in an image using pretrained models.
    
    Args:
        file_path: Path to the uploaded image
        sample_id: Unique identifier for the sample
        lat: Latitude coordinate
        lon: Longitude coordinate
        model_type: Type of model to use ("unet" or "yolov5")
        
    Returns:
        SiteVerificationResponse with detection results
    """
    # Try Mistral API first if available and requested
    if MISTRAL_AVAILABLE and model_type == "mistral":
        try:
            result = await _run_mistral_detection(file_path, sample_id, lat, lon)
            return result
        except Exception as e:
            print(f"Mistral detection failed: {e}")
            # Fall back to other methods if Mistral fails
    
    if MODEL_IMPORTS_AVAILABLE:
        # Load and run the actual model
        result = await _run_actual_model_detection(
            file_path, sample_id, lat, lon, model_type
        )
    else:
        # Use mock implementation for now
        result = await _run_mock_detection(
            file_path, sample_id, lat, lon, model_type
        )
    
    return result

async def _run_mistral_detection(
    file_path: str,
    sample_id: str,
    lat: float,
    lon: float
) -> SiteVerificationResponse:
    """
    Run solar panel detection using Mistral AI Vision API.
    """
    # Get Mistral API key from environment variable
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY environment variable not set")
    
    # Initialize Mistral client
    client = MistralClient(api_key=api_key)
    
    # Convert image to base64
    with open(file_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Create prompt for solar panel detection
    prompt = """
    Analyze this aerial/satellite image and determine if there are solar panels present.
    Look specifically for:
    1. Dark rectangular or square panels arranged in grids
    2. Panels with reflective surfaces
    3. Structures on rooftops or open areas
    4. Typical solar panel installations
    
    Respond ONLY with a JSON object in this exact format:
    {
        "has_solar": true/false,
        "confidence": 0.0-1.0,
        "panel_count": integer or null,
        "explanation": "brief explanation"
    }
    """
    
    # Create message with image
    messages = [
        ChatMessage(
            role="user",
            content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{encoded_image}"}
            ]
        )
    ]
    
    # Call Mistral API
    response = client.chat(
        model="mistral-large-latest",
        messages=messages,
        temperature=0.1,
        max_tokens=300
    )
    
    # Parse response
    try:
        # Extract JSON from response
        response_text = response.choices[0].message.content.strip()
        # Find JSON in response (handle potential markdown formatting)
        import json
        import re
        
        # Try to extract JSON object
        json_match = re.search(r'\{[^}]+\}', response_text)
        if json_match:
            result_data = json.loads(json_match.group())
        else:
            # Fallback parsing
            result_data = json.loads(response_text)
        
        has_solar = result_data.get("has_solar", False)
        confidence = float(result_data.get("confidence", 0.0))
        panel_count = result_data.get("panel_count")
        explanation = result_data.get("explanation", "")
        
        # Estimate area and capacity based on panel count
        if panel_count and panel_count > 0:
            # Average panel size: 1.6 m², 300W per panel
            pv_area_sqm = panel_count * 1.6
            capacity_kw = (panel_count * 300) / 1000.0
        else:
            pv_area_sqm = 0.0
            capacity_kw = 0.0
            panel_count = None
        
        # Determine QC status
        qc_status = "VERIFIABLE" if confidence > 0.7 else "NOT_VERIFIABLE"
        qc_notes = [explanation] if explanation else []
        
        # Create response
        response_obj = SiteVerificationResponse(
            sample_id=sample_id,
            lat=lat,
            lon=lon,
            has_solar=has_solar,
            confidence=confidence,
            panel_count_est=panel_count,
            pv_area_sqm_est=pv_area_sqm,
            capacity_kw_est=capacity_kw,
            qc_status=qc_status,
            qc_notes=qc_notes,
            bbox_or_mask={
                "type": "mistral_analysis",
                "data": explanation
            },
            image_metadata={
                "source": "uploaded_image",
                "capture_date": datetime.now().strftime("%Y-%m-%d"),
                "model_type": "mistral"
            },
            detection_evidence_hash=str(uuid.uuid4()),
            certificate_url=None,
            blockchain_tx={
                "network": "mock",
                "tx_hash": None,
                "block": None
            },
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        return response_obj
        
    except Exception as e:
        raise Exception(f"Failed to parse Mistral response: {str(e)}. Raw response: {response_text}")

async def _run_actual_model_detection(
    file_path: str,
    sample_id: str,
    lat: float,
    lon: float,
    model_type: str
) -> SiteVerificationResponse:
    """
    Run actual model detection using pretrained models.
    """
    # Load the appropriate model
    if model_type == "unet":
        model = UNet(n_channels=3, n_classes=1)
        model_path = "weights/unet_final.pth"
    elif model_type == "yolov5":
        model = YOLOv5()
        model_path = "weights/yolov5_final.pth"
    else:
        raise ValueError(f"Unsupported model type: {model_type}")
    
    # Load model weights
    if os.path.exists(model_path):
        model.load_state_dict(
            torch.load(model_path, map_location="cpu")
        )
        model.eval()
    else:
        raise FileNotFoundError(f"Model weights not found at {model_path}")
    
    # Load and preprocess image
    img = Image.open(file_path)
    transform = T.Compose([
        T.Resize((512, 512)),  # Resize to model input size
        T.ToTensor()
    ])
    x = transform(img).unsqueeze(0)  # Add batch dimension
    
    # Run inference
    with torch.no_grad():
        pred = model(x)
    
    # Process predictions
    has_solar, confidence, panel_count, pv_area, capacity, bbox_data = _process_predictions(
        pred, model_type
    )
    
    # Determine QC status
    qc_status = "VERIFIABLE" if confidence > 0.7 else "NOT_VERIFIABLE"
    qc_notes = [] if qc_status == "VERIFIABLE" else ["Low confidence score"]
    
    # Create response
    response = SiteVerificationResponse(
        sample_id=sample_id,
        lat=lat,
        lon=lon,
        has_solar=has_solar,
        confidence=confidence,
        panel_count_est=panel_count,
        pv_area_sqm_est=pv_area,
        capacity_kw_est=capacity,
        qc_status=qc_status,
        qc_notes=qc_notes,
        bbox_or_mask={
            "type": "mask" if model_type == "unet" else "bbox",
            "data": str(bbox_data)
        },
        image_metadata={
            "source": "uploaded_image",
            "capture_date": datetime.now().strftime("%Y-%m-%d"),
            "model_type": model_type
        },
        detection_evidence_hash=str(uuid.uuid4()),
        certificate_url=None,  # Will be generated later if VERIFIABLE
        blockchain_tx={
            "network": "mock",
            "tx_hash": None,
            "block": None
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    return response

def _process_predictions(pred, model_type: str):
    """
    Process model predictions to extract detection results.
    """
    if model_type == "unet":
        # For segmentation model, calculate area
        mask = torch.sigmoid(pred).squeeze().numpy()
        mask = (mask > 0.5).astype(np.uint8)
        
        # Calculate area in pixels
        area_pixels = np.sum(mask)
        
        # Convert to square meters (simplified)
        # Assuming 1 pixel = 0.1m x 0.1m = 0.01 sqm
        pv_area_sqm = area_pixels * 0.01
        
        # Estimate panel count (simplified)
        panel_count = int(pv_area_sqm / 1.6)  # Average panel size ~1.6 sqm
        
        # Estimate capacity (assuming 170 Wp/m²)
        capacity_kw = (pv_area_sqm * 170) / 1000
        
        # Confidence based on mask quality
        confidence = float(np.mean(mask)) if np.sum(mask) > 0 else 0.0
        
        has_solar = confidence > 0.1
        bbox_data = mask.tolist()
        
    else:  # yolov5
        # For detection model, extract bounding boxes
        # This is a simplified implementation
        detections = pred.tolist()  # Convert to list
        
        # Filter for high-confidence detections
        high_conf_detections = [d for d in detections if d[4] > 0.5]
        
        if len(high_conf_detections) > 0:
            has_solar = True
            confidence = float(np.mean([d[4] for d in high_conf_detections]))
            
            # Calculate total area from bounding boxes
            total_area = 0
            for det in high_conf_detections:
                # det format: [x1, y1, x2, y2, confidence, class]
                width = det[2] - det[0]
                height = det[3] - det[1]
                total_area += width * height
            
            # Convert to square meters (simplified)
            pv_area_sqm = total_area * 0.0001  # Simplified conversion
            
            # Estimate panel count
            panel_count = len(high_conf_detections)
            
            # Estimate capacity
            capacity_kw = (pv_area_sqm * 170) / 1000
            
            bbox_data = high_conf_detections
        else:
            has_solar = False
            confidence = 0.0
            panel_count = None
            pv_area_sqm = None
            capacity_kw = None
            bbox_data = []
    
    return has_solar, confidence, panel_count, pv_area_sqm, capacity_kw, bbox_data

async def _run_mock_detection(
    file_path: str,
    sample_id: str,
    lat: float,
    lon: float,
    model_type: str
) -> SiteVerificationResponse:
    """
    Run mock detection for demonstration purposes.
    """
    # Simple heuristic based on sample_id
    try:
        site_num = int(sample_id.replace('site_', ''))
        has_solar = site_num % 2 == 1  # Alternate between having solar and not
    except:
        has_solar = True  # Default to having solar panels
    
    if has_solar:
        confidence = 0.92
        panel_count = 12
        pv_area_sqm = 20.5
        capacity_kw = 3.5
        qc_status = "VERIFIABLE"
        qc_notes = []
        bbox_data = "mock_bbox_data"
    else:
        confidence = 0.3
        panel_count = None
        pv_area_sqm = None
        capacity_kw = None
        qc_status = "NOT_VERIFIABLE"
        qc_notes = ["Low confidence score"]
        bbox_data = "no_solar_detected"
    
    # Create response
    response = SiteVerificationResponse(
        sample_id=sample_id,
        lat=lat,
        lon=lon,
        has_solar=has_solar,
        confidence=confidence,
        panel_count_est=panel_count,
        pv_area_sqm_est=pv_area_sqm,
        capacity_kw_est=capacity_kw,
        qc_status=qc_status,
        qc_notes=qc_notes,
        bbox_or_mask={
            "type": "mask" if model_type == "unet" else "bbox",
            "data": bbox_data
        },
        image_metadata={
            "source": "uploaded_image",
            "capture_date": datetime.now().strftime("%Y-%m-%d"),
            "model_type": model_type
        },
        detection_evidence_hash=str(uuid.uuid4()),
        certificate_url=None,
        blockchain_tx={
            "network": "mock",
            "tx_hash": None,
            "block": None
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    return response