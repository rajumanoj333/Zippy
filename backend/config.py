import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Zippy - WhatsApp Swiggy AI Assistant"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Gemini & OpenAI Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("AGY_KEY", ""))
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # WhatsApp / Evolution API Settings
    EVOLUTION_API_URL: str = os.getenv("EVOLUTION_API_URL", "http://localhost:8080")
    EVOLUTION_API_KEY: str = os.getenv("EVOLUTION_API_KEY", "zippy_secret_key")
    EVOLUTION_INSTANCE: str = os.getenv("EVOLUTION_INSTANCE", "zippy_whatsapp")
    
    # Twilio Settings (Fallback/Alternative)
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "whatsapp:+14155238886")

    # App Defaults
    DEFAULT_LOCATION: str = "Indiranagar, Bengaluru"
    DEFAULT_PAYMENT_METHOD: str = "Swiggy Money / UPI"

settings = Settings()
