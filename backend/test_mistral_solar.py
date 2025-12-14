import os
import base64
from mistralai import Mistral
import json
import re

def test_mistral_solar_detection():
    """
    Test Mistral AI for solar panel detection
    """
    # Get API key
    api_key = "6Bl6sEXXuOej1Xiyj5frlwbe3qmP6sxk"
    
    if not api_key:
        raise ValueError("MISTRAL_API_KEY environment variable not set")

    # Initialize client
    client = Mistral(api_key=api_key)
    
    # For testing, we'll use a simple prompt without an actual image
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
        "explanation": "Clear solar panel arrays visible on rooftops with characteristic dark rectangular shapes arranged in grids."
    }
    """
    
    try:
        print("Testing Mistral AI for solar panel detection...")
        
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
            max_tokens=300
        )
        
        # Extract response text
        response_text = chat_response.choices[0].message.content.strip()
        print(f"Raw response: {response_text}")
        
        # Parse JSON response
        json_match = re.search(r'\{[^}]+\}', response_text)
        if json_match:
            result_data = json.loads(json_match.group())
        else:
            result_data = json.loads(response_text)
        
        print("\nParsed Results:")
        print(f"  Has Solar: {result_data.get('has_solar')}")
        print(f"  Confidence: {result_data.get('confidence')}")
        print(f"  Panel Count: {result_data.get('panel_count')}")
        print(f"  Explanation: {result_data.get('explanation')}")
        
        print("\nMistral AI solar panel detection test successful!")
        
    except Exception as e:
        print(f"Error testing Mistral AI solar detection: {e}")

# Run the test
if __name__ == "__main__":
    test_mistral_solar_detection()