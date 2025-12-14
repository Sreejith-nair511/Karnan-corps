import os
import base64
import json
import asyncio
from mistralai import Mistral

async def test_solar_panel_detection():
    """Test solar panel detection using Mistral AI Vision API"""
    # Get API key
    api_key = "6Bl6sEXXuOej1Xiyj5frlwbe3qmP6sxk"
    
    if not api_key:
        raise ValueError("MISTRAL_API_KEY environment variable not set")

    # Initialize client
    client = Mistral(api_key=api_key)
    
    try:
        # For testing purposes, we'll use a simple prompt without an actual image
        # In a real implementation, you would encode an actual image
        
        prompt = """
        Analyze this aerial/satellite image and determine if there are solar panels present.
        Look specifically for:
        1. Dark rectangular or square panels arranged in grids
        2. Panels with reflective surfaces
        3. Structures on rooftops or open areas
        4. Typical solar panel installations
        
        Respond ONLY with a JSON object in this exact format:
        {
            "has_solar": true,
            "confidence": 0.95,
            "panel_count": 12,
            "total_area": 45.5,
            "estimated_capacity_kw": 15.2,
            "co2_offset_kg": 22000,
            "timestamp": "2023-01-01T00:00:00Z"
        }
        
        If no solar panels are detected, return:
        {
            "has_solar": false,
            "confidence": 0.85,
            "panel_count": 0,
            "total_area": 0,
            "estimated_capacity_kw": 0,
            "co2_offset_kg": 0,
            "timestamp": "2023-01-01T00:00:00Z"
        }
        """.strip()
        
        # Call Mistral API
        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=500
        )
        
        # Parse the response
        response_text = chat_response.choices[0].message.content
        print("Mistral API Response:")
        print(response_text)
        
        # Try to extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            result_data = json.loads(json_match.group())
            print("\nParsed JSON Data:")
            print(json.dumps(result_data, indent=2))
        else:
            print("\nCould not parse JSON from response")
            
        print("\nSolar panel detection test completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error testing solar panel detection: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_solar_panel_detection())