#!/usr/bin/env python3
"""
Test script for OpenStreetMap integration
"""

import asyncio
import sys
import os

# Add the app directory to the path so we can import our modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'app'))

# Import the function directly
import httpx
import json

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

async def test_osm_integration():
    """Test the OpenStreetMap integration with a sample location"""
    print("Testing OpenStreetMap integration...")
    
    # Test with a location in California (solar-friendly region)
    lat = 34.0522  # Los Angeles
    lon = -118.2437
    
    try:
        location_data = await _fetch_location_data(lat, lon)
        print("Successfully fetched location data:")
        print(f"  Place: {location_data.get('display_name', 'Unknown')}")
        print(f"  Type: {location_data.get('type', 'Unknown')}")
        
        # Check if we got address details
        address = location_data.get('address', {})
        if address:
            print("  Address details:")
            for key, value in list(address.items())[:5]:  # Show first 5 items
                print(f"    {key}: {value}")
        
        print("\nTest completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error fetching location data: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_osm_integration())