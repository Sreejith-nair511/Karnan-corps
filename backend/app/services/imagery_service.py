import os
import httpx
from typing import Tuple, Optional
from PIL import Image, ImageDraw
import uuid
import json

async def fetch_imagery(
    sample_id: str,
    lat: float,
    lon: float,
    buffer_radius_m: int = 20,
    provider: str = "mock"
) -> Tuple[str, str]:
    """
    Fetch high-res rooftop imagery for a given location.
    
    Args:
        sample_id: The sample ID
        lat: Latitude
        lon: Longitude
        buffer_radius_m: Buffer radius in meters
        provider: Imagery provider (mock, mapbox, sentinel, etc.)
        
    Returns:
        Tuple of (image_path, metadata)
    """
    # Create images directory if it doesn't exist
    images_dir = "data/images"
    os.makedirs(images_dir, exist_ok=True)
    
    if provider == "openstreetmap":
        # Try to fetch real location data from OpenStreetMap
        try:
            location_data = await _fetch_location_data(lat, lon)
            image_path = await _generate_location_based_image(sample_id, images_dir, location_data)
            metadata = json.dumps({
                "source": "openstreetmap", 
                "capture_date": "2023-01-15",
                "location_data": location_data
            })
        except Exception as e:
            # Fallback to mock if API fails
            image_path = await _generate_mock_image(sample_id, images_dir)
            metadata = json.dumps({
                "source": "mock", 
                "capture_date": "2023-01-15",
                "error": str(e)
            })
    elif provider == "mock":
        # Generate a mock image
        image_path = await _generate_mock_image(sample_id, images_dir)
        metadata = json.dumps({
            "source": "mock", 
            "capture_date": "2023-01-15"
        })
    else:
        # In a real implementation, we would fetch from the actual provider
        # For now, we'll just generate a mock image
        image_path = await _generate_mock_image(sample_id, images_dir)
        metadata = json.dumps({
            "source": provider, 
            "capture_date": "2023-01-15"
        })
    
    return image_path, metadata

async def _fetch_location_data(lat: float, lon: float) -> dict:
    """
    Fetch location data from OpenStreetMap Nominatim.
    
    Args:
        lat: Latitude
        lon: Longitude
        
    Returns:
        Location data dictionary
    """
    # OpenStreetMap Nominatim API endpoint
    url = f"https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": lat,
        "lon": lon,
        "format": "json"
    }
    headers = {
        "User-Agent": "Karnan-Solar-Verification-App/1.0"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()

async def _generate_location_based_image(sample_id: str, images_dir: str, location_data: dict) -> str:
    """
    Generate an image based on location data.
    
    Args:
        sample_id: The sample ID
        images_dir: Directory to save the image
        location_data: Location data from OpenStreetMap
        
    Returns:
        Path to the generated image
    """
    # Create a simple image with location information
    image = Image.new('RGB', (512, 512), color='lightblue')
    draw = ImageDraw.Draw(image)
    
    # Draw a simple house shape
    draw.rectangle([100, 200, 400, 400], fill='brown')  # House
    draw.polygon([(100, 200), (250, 100), (400, 200)], fill='red')  # Roof
    
    # Add some solar panels (if in a region that might have solar panels)
    # Simple heuristic: if address contains certain keywords
    address = location_data.get('display_name', '').lower()
    has_solar_potential = any(keyword in address for keyword in ['california', 'nevada', 'arizona', 'texas', 'florida'])
    
    if has_solar_potential:
        # Draw solar panels
        for i in range(3):
            for j in range(4):
                x = 150 + i * 30
                y = 250 + j * 20
                draw.rectangle([x, y, x + 25, y + 15], fill='black')
    
    # Add location text
    place_name = location_data.get('name', 'Unknown Location')
    if not place_name:
        address_parts = location_data.get('address', {})
        place_name = address_parts.get('city', address_parts.get('town', address_parts.get('village', 'Unknown Location')))
    
    # Save image
    image_filename = f"{sample_id}_imagery.png"
    image_path = os.path.join(images_dir, image_filename)
    image.save(image_path)
    
    return image_path

async def _generate_mock_image(sample_id: str, images_dir: str) -> str:
    """
    Generate a mock rooftop image.
    
    Args:
        sample_id: The sample ID
        images_dir: Directory to save the image
        
    Returns:
        Path to the generated image
    """
    # Create a simple mock image with some shapes to represent a rooftop
    image = Image.new('RGB', (512, 512), color='lightblue')
    draw = ImageDraw.Draw(image)
    
    # Draw a simple house shape
    draw.rectangle([100, 200, 400, 400], fill='brown')  # House
    draw.polygon([(100, 200), (250, 100), (400, 200)], fill='red')  # Roof
    
    # Add some solar panels (if lat > 0 for mock logic)
    if float(sample_id.replace('site_', '')) % 2 == 1:
        # Draw solar panels
        for i in range(3):
            for j in range(4):
                x = 150 + i * 30
                y = 250 + j * 20
                draw.rectangle([x, y, x + 25, y + 15], fill='black')
    
    # Save image
    image_filename = f"{sample_id}_imagery.png"
    image_path = os.path.join(images_dir, image_filename)
    image.save(image_path)
    
    return image_path