# main.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import asyncio
from config import setup_cors
from models import Outfit
from services import process_image_service, test_frontend_service

app = FastAPI()

# Setup CORS
setup_cors(app)

@app.post('/process-image')
async def process_image(
    file: UploadFile = File(...),
    gender: str = Form(...),
    styleType: str = Form(...),
    accessory: str = Form(...),
    location: str = Form(...),
    brand: str = Form(...)
):
    try:
        image = Image.open(io.BytesIO(await file.read()))
        additional_prompt = {
            "gender": gender,
            "style": styleType,
            "accessory": accessory,
            "location": location,
            "brand": brand
        }
        response = await process_image_service(image, additional_prompt)
        print(response)
        if response:
            return JSONResponse(content=response)
        else:
            raise HTTPException(status_code=500, detail="Error processing the image.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/test-frontend')
def test_frontend(
    file: UploadFile = File(...),
    gender: str = Form(...),
    styleType: str = Form(...),
    accessory: str = Form(...)
):
    return test_frontend_service(file, gender, styleType, accessory)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)