import os
from mistralai import Mistral

# Get API key
api_key = "6Bl6sEXXuOej1Xiyj5frlwbe3qmP6sxk"

# Check if API key is available
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
    
except Exception as e:
    print(f"Error testing Mistral API: {e}")