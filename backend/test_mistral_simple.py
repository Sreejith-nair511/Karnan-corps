import os
import base64
from mistralai import Mistral
import json

def test_mistral_integration():
    """Test the Mistral API integration"""
    # Get API key
    api_key = "6Bl6sEXXuOej1Xiyj5frlwbe3qmP6sxk"
    
    if not api_key:
        raise ValueError("MISTRAL_API_KEY environment variable not set")

    # Initialize client
    client = Mistral(api_key=api_key)
    
    try:
        # Test with a simple prompt
        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "user",
                    "content": "Hello, world!",
                },
            ]
        )
        
        print("Response:", chat_response.choices[0].message.content)
        print("Mistral API integration test successful!")
        return True
        
    except Exception as e:
        print(f"Error testing Mistral API: {e}")
        return False

if __name__ == "__main__":
    test_mistral_integration()