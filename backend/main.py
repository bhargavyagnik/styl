from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import google.generativeai as genai
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import asyncio
import requests
from requests.exceptions import RequestException


# Load environment variables
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
google_api_key = os.getenv('GOOGLE_SEARCH_API_KEY')
google_cx = os.getenv('SEARCH_ENGINE_ID')

# Configure the Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Outfit data model using Pydantic
class Outfit(BaseModel):
    outfit: List[str] = Field(..., description="List of clothes that can be worn together.")

# Define the output parser for the API response
parser = PydanticOutputParser(pydantic_object=Outfit)

# Define the prompt template for generating content
prompt_template = PromptTemplate(
    template="""
    You are Vogue's AI fashion stylist. You know the latest trends and styles. You have been asked to suggest clothes based on the image.
    Based on the image, what are the color coordinated clothes that can be worn?.
    If this is a tshirt, suggest multiple colors of pants at max 10. If this is a pant, suggest multiple colors of tshirts at max 10.
    If this is a dress, suggest multiple colors of shoes at max 10. If this is a shoe, suggest multiple colors of dresses at max 10.
    If this is a hat, suggest multiple colors of shirts at max 10. If this is a shirt, suggest multiple colors of hats at max 10.
    For example. If the image is a polo tshirt of aqua blue color, suggest multiple colors of pants that can be worn with it.
    You can return a list that could be : ["black pant", "biege pant", "dark blue pant", "blue pant"]. This is just an example.
    Suggest {accessory} based on {style} style for gender {gender}.
    \n{format_instruction}\n Return in JSON object only.""",
    partial_variables={"format_instruction": parser.get_format_instructions()}
)

#https://programmablesearchengine.google.com/controlpanel/overview?cx=f5d90e0e4ebf94301
def search_images(item,query, api_key, cx):
    search_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'q': query,
        'cx': cx,
        'key': api_key,
        'searchType': 'image',
        'num': 2  # Number of results to return
    }

    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        search_results = response.json()
        
        if 'items' in search_results and len(search_results['items']) > 0:
            first_result = search_results['items'][0]
            return {
                'item': item,
                'page_url': first_result['image']['contextLink'],
                'image_url': first_result['link']
            }
        else:
            return {
                'page_url': f'No results found for {query}',
                'image_url': 'No image found'
            }
    except RequestException as e:
        print(f"An error occurred: {e}")
        return {
            'page_url': f'Error occurred while searching for {query}',
            'image_url': 'Error occurred'
        }

def get_images(outfit_response,additional_prompt):
    results = []
    for item in outfit_response.outfit:
        query = f"{additional_prompt['gender']} + AND + {item} + AND + {additional_prompt['accessory']}"
        task = search_images(item,query, google_api_key, google_cx)
        results.append(task)
    return results

# Function to query the Gemini API asynchronously
async def query_gemini(prompt, image):
    try:
        response = await asyncio.to_thread(model.generate_content, [prompt, image])
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None 

# Function to process the image and get a response from the Gemini API
async def ask_gemini(image,additional_prompt):
    prompt = prompt_template.format(gender=additional_prompt['gender'],style=additional_prompt['style'],accessory=additional_prompt['accessory'])
    response = await query_gemini(prompt, image)
    if response:
        try:
            parsed_response = parser.parse(response)
            return parsed_response
        except Exception as e:
            print(f"Error parsing response: {e}")
            return None
    else:
        return None

# Define the route for image processing
@app.post('/process-image')
async def process_image(file: UploadFile = File(...), gender:str = Form(...), styleType:str = Form(...),accessory:str = Form(...)):
    
    try:
        # Convert the uploaded file to a PIL image
        image = Image.open(io.BytesIO(await file.read()))
        additional_prompt = {"gender":gender,"style":styleType,"accessory":accessory}
        print(additional_prompt)
        # Process the image and get the response
        response = await ask_gemini(image,additional_prompt)
        
        if response:
            image_response = get_images(response,additional_prompt)
            print(image_response)
            return JSONResponse(content=image_response)
        else:
            raise HTTPException(status_code=500, detail="Error processing the image.")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Main entry point for running the app
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    #uvicorn main:app --host 0.0.0.0 --port 8000 --reload