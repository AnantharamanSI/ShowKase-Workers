from base64 import b64encode
import requests
from PIL import Image
from io import BytesIO

def fetch_and_convert_image_to_base64(image_url):
    try:
        # Fetch the image
        response = requests.get(image_url)
        response.raise_for_status()  # Ensure the request was successful

        # Open the image as a byte stream
        img = Image.open(BytesIO(response.content))

        # Convert the image to RGB (to ensure compatibility)
        img_rgb = img.convert('RGB')

        # Save the image to a byte stream as JPEG (to ensure compatibility)
        byte_stream = BytesIO()
        img_rgb.save(byte_stream, format='JPEG')

        # Encode the byte stream to Base64
        base64_string = b64encode(byte_stream.getvalue()).decode('utf-8')

        return f"data:image/jpeg;base64,{base64_string}"
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Example usage
image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/181px-Cat_August_2010-4.jpg"
base64_image = fetch_and_convert_image_to_base64(image_url)
if base64_image:
    print(base64_image)  # Print the first 100 characters to check if it worked
