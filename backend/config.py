# config.py
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables
load_dotenv()

# API keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GOOGLE_SEARCH_API_KEY = os.getenv('GOOGLE_SEARCH_API_KEY')
SEARCH_ENGINE_ID = os.getenv('SEARCH_ENGINE_ID')

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)
GEMINI_MODEL = genai.GenerativeModel('gemini-1.5-flash')

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )