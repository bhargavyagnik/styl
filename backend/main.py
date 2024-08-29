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
    allow_origins=["*"],
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
    You are Vogue's AI fashion stylist. You know the latest trends and styles. You have been asked to suggest clothes or accessories based on the image.
    Based on the image, what are the color coordinated clothes that can be worn?.
    First, understand the color, type of clothing, and style and also the size of the person in the image.
    Now suggest multiple clothes that can be worn with the image.
    For example. If the image of a Male in a polo tshirt of aqua blue color, and you are asked to suggest multiple colors of accessory=Tshirt of Casual that can be worn with it.
    You can return a list that could be : ["black slimfit pant", "biege pant", "dark blue cargo pant", "blue denim pant"]. If it was formal, I could suggest shirts that could be worn 
    at an office etc. Based on gender the type of accessory and color of the accessory could change and as you are the AI fashion stylist you know the best.
    For example. If the image of a Female in a light yellow sweatshirt, and you are asked to suggest multiple colors of accessory=pants of sporty that can be worn with it.
    You can return a list that could be : ["green shorts", "light yellow sweatpants", "white thermal shorts", "white pleated skirt"]. If the accessory=shoes
    I would return some sport shoes colors i can match and styles.
    Based on gender the type of accessory and color of the accessory could change and as you are the AI fashion stylist you know the best. Be creative in reponse
    Suggest various fashions, styles as you are aware of the latest trends.
    If I ask for shoes, suggest shoes only, If I ask for pants, suggest pants/skirts/trousers/jeans/shorts only. If I ask for tshirts, suggest tshirts/shirts only.
    If I ask for sunglasses, suggest sunglasses only.
    Return the list with at max 5 items.
    Based on current trends i, suggest the best {accessory} that can be worn with the image by {gender}.
    The result should be a color then followed by the type of clothing. Like white slimfit pant, or white-black ovresized tshirt, or yellow polo tshirt or black leather shoes or white sneakers or blue tinted sunglasses etc. No need to mention more complex details.
    If possible give from product catalog of just one brand - {brand} only.
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
        'num': 1  # Number of results to return
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
            return None
    except RequestException as e:
        print(f"An error occurred: {e}")
        return {
            'page_url': f'Error occurred while searching for {query}',
            'image_url': 'Error occurred'
        }

def get_images(outfit_response,additional_prompt):
    results = []
    for item in outfit_response.outfit:
        query = f"{item} + AND + {additional_prompt['gender']} + AND +  {additional_prompt['accessory']}+ AND +gl:{additional_prompt['location']} "
        #site:{additional_prompt['brand']}.*
        task = search_images(item,query, google_api_key, google_cx)
        if task!=None:
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
    prompt = prompt_template.format(gender=additional_prompt['gender'],style=additional_prompt['style'],accessory=additional_prompt['accessory'],brand=additional_prompt['brand'])
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
async def process_image(file: UploadFile = File(...), gender:str = Form(...), styleType:str = Form(...),accessory:str = Form(...),location:str = Form(...),brand:str = Form(...)):
    print(location)
    try:
        # Convert the uploaded file to a PIL image
        image = Image.open(io.BytesIO(await file.read()))
        additional_prompt = {"gender":gender,"style":styleType,"accessory":accessory,"location":location,"brand":brand}
        #print(additional_prompt)
        # Process the image and get the response
        response = await ask_gemini(image,additional_prompt)
        
        if response:
            print(response)
            image_response = get_images(response,additional_prompt)
            print(image_response)
            if len(image_response) == 0:
                raise HTTPException(status_code=404, detail="No results found")
            return JSONResponse(content=image_response)
        else:
            raise HTTPException(status_code=500, detail="Error processing the image.")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post('/test-frontend')
def test_frontend(file: UploadFile = File(...), gender:str = Form(...), styleType:str = Form(...),accessory:str = Form(...)):
    ret_list = [[{'item': 'White graphic tee', 'page_url': 'https://www.zara.com/us/en/raised-graphic-t-shirt-p06224448.html', 'image_url': 'https://static.zara.net/assets/public/fcbb/b8ad/ea7e424ab883/5c239f53027f/06224448250-p/06224448250-p.jpg?ts=1714046466010&w=824'}, {'item': 'Light blue linen shirt', 'page_url': 'https://www2.hm.com/en_gb/productpage.0494713113.html', 'image_url': 'https://image.hm.com/assets/006/fe/7f/fe7f3b16599a4ebcb3fbbfb1aec9f33e0aef37b0.jpg?imwidth=2160'}, {'item': 'Striped  tee', 'page_url': 'https://www2.hm.com/en_hk/productpage.1209625001.html', 'image_url': 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F39%2F22%2F39221e86d1f544d576fe9e3261c7d42ba66499c3.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]'}, {'item': 'Pale yellow Henley', 'page_url': 'https://www2.hm.com/en_asia1/productpage.1128811001.html', 'image_url': 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F0c%2Fd4%2F0cd4faadf8d855e68c208787baec2ba0717812a6.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]'}, {'item': 'Oversized  crew neck', 'page_url': 'https://www2.hm.com/en_us/productpage.1189462006.html', 'image_url': 'https://image.hm.com/assets/hm/7d/0d/7d0dbe6a25bf3c013a874db668b5f0d4d38cd9a2.jpg?imwidth=2160'}],[{'item': 'White oversized T-shirt', 'page_url': 'https://www2.hm.com/en_my/productpage.1074658002.html', 'image_url': 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F45%2F58%2F45589d4f97bfb3386e0acf77e4066534c83f7d9d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]'}, {'item': 'Light blue linen shirt', 'page_url': 'https://www2.hm.com/en_gb/productpage.0494713113.html', 'image_url': 'https://image.hm.com/assets/006/fe/7f/fe7f3b16599a4ebcb3fbbfb1aec9f33e0aef37b0.jpg?imwidth=2160'}, {'item': 'Striped button-down shirt', 'page_url': 'https://www2.hm.com/en_us/productpage.1232514001.html', 'image_url': 'https://image.hm.com/assets/hm/1e/ab/1eab87342197080057054350bf5d0a676bf01953.jpg?imwidth=2160'}, {'item': 'Oversized graphic tee', 'page_url': 'https://www.uniqlo.com/us/en/stylingbook/stylehint/4242903', 'image_url': 'https://api.fastretailing.com/ugc/v1/uq/fr/SR_IMAGES/ugc_stylehint_uq_fr_photo_230623_1121358_r-1000-1333'}, {'item': 'Black Henley shirt', 'page_url': 'https://www.zara.com/us/en/henley-t-shirt-p04231302.html', 'image_url': 'https://static.zara.net/assets/public/428a/3527/80854561bbbc/c2b4d8d9e9af/04231302800-p/04231302800-p.jpg?ts=1720783703871&w=824'}]]
    import random,time
    time.sleep(2)
    return JSONResponse(content=random.choice(ret_list))

# Main entry point for running the app
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    #uvicorn main:app --host 0.0.0.0 --port 8000 --reload