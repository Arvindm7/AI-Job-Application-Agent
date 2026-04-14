import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    BASE_URL = os.getenv("BASE_URL")
    MODEL_NAME = os.getenv("MODEL_NAME")

    APP_HOST = os.getenv("APP_HOST")  
    APP_PORT = int(os.getenv("APP_PORT"))      
    APP_RELOAD = os.getenv("APP_RELOAD").lower() == "true"

    JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY")
    JSEARCH_API_URL = os.getenv("JSEARCH_API_URL")
    JSEARCH_API_HOST = os.getenv("JSEARCH_API_HOST")

settings = Settings()