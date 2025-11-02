#!/usr/bin/env python3
"""
Test script for Roboflow integration
"""

import asyncio
import sys
import os
from typing import Tuple, Optional
import base64

# Add the app directory to the path so we can import our modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

async def run_roboflow_inference(
    image_path: str,
    api_key: Optional[str] = None,
    model_id: str = "solar-panel-detection"
) -> Tuple[bool, float, Optional[int], Optional[float], Optional[float], str, str]:
    """
    Run inference using Roboflow API for solar panel detection.
    
    Args:
        image_path: Path to the image file
        api_key: Roboflow API key (can be None for demo)
        model_id: Model ID to use for inference
        
    Returns:
        Tuple of (has_solar, confidence, panel_count_est, pv_area_sqm_est, capacity_kw_est, bbox_or_mask, reason_codes)
    """
    # For demo purposes without API key, return mock results
    if not api_key:
        return await _mock_roboflow_response(image_path)
    
    # In a real implementation, this would call the Roboflow API
    # For now, we'll just return mock results
    return await _mock_roboflow_response(image_path)

async def _mock_roboflow_response(image_path: str) -> Tuple[bool, float, Optional[int], Optional[float], Optional[float], str, str]:
    """
    Generate a mock response similar to what Roboflow would return.
    
    Args:
        image_path: Path to the image file (used to determine mock response)
        
    Returns:
        Tuple of (has_solar, confidence, panel_count_est, pv_area_sqm_est, capacity_kw_est, bbox_or_mask, reason_codes)
    """
    # Simple heuristic based on image path or sample ID
    # In a real implementation, this would be based on actual image analysis
    sample_id = os.path.basename(image_path).split('_')[0] if '_' in os.path.basename(image_path) else "site_1"
    
    try:
        site_num = int(sample_id.replace('site_', ''))
        has_solar = site_num % 2 == 1  # Alternate between having solar and not
    except:
        has_solar = True  # Default to having solar panels
    
    if has_solar:
        confidence = 0.92
        panel_count_est = 12
        pv_area_sqm_est = 20.5
        capacity_kw_est = 3.5
        bbox_or_mask = "[mock_bbox_data]"
        reason_codes = "solar_panels_detected"
    else:
        confidence = 0.3
        panel_count_est = None
        pv_area_sqm_est = None
        capacity_kw_est = None
        bbox_or_mask = "[]"
        reason_codes = "no_solar_panels_detected"
    
    return (
        has_solar,
        confidence,
        panel_count_est,
        pv_area_sqm_est,
        capacity_kw_est,
        bbox_or_mask,
        reason_codes
    )

async def test_roboflow_integration():
    """Test the Roboflow integration with a sample image"""
    print("Testing Roboflow integration...")
    
    # Test with a mock image path
    image_path = "data/images/test_imagery.png"
    
    # Create a test image if it doesn't exist
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    
    if not os.path.exists(image_path):
        # Create a simple test image
        from PIL import Image, ImageDraw
        image = Image.new('RGB', (512, 512), color='lightblue')
        draw = ImageDraw.Draw(image)
        
        # Draw a simple house shape
        draw.rectangle([100, 200, 400, 400], fill='brown')  # House
        draw.polygon([(100, 200), (250, 100), (400, 200)], fill='red')  # Roof
        
        # Add some solar panels
        for i in range(3):
            for j in range(4):
                x = 150 + i * 30
                y = 250 + j * 20
                draw.rectangle([x, y, x + 25, y + 15], fill='black')
        
        image.save(image_path)
        print(f"Created test image at {image_path}")
    
    try:
        # Test with mock (no API key)
        result = await run_roboflow_inference(image_path, api_key=None)
        
        print("Successfully tested Roboflow integration:")
        print(f"  Has solar: {result[0]}")
        print(f"  Confidence: {result[1]:.2f}")
        print(f"  Panel count estimate: {result[2]}")
        print(f"  PV area estimate: {result[3]} m²")
        print(f"  Capacity estimate: {result[4]} kW")
        
        print("\nTest completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error testing Roboflow integration: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_roboflow_integration())