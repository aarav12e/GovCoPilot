import os
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY    = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY    = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SARVAM_API_KEY    = os.getenv("SARVAM_API_KEY", "")
SECRET_KEY        = os.getenv("SECRET_KEY", "govcopilot-secret-2026")
ALGORITHM         = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
MAX_FILE_SIZE_MB  = int(os.getenv("MAX_FILE_SIZE_MB", 50))
UPLOAD_DIR        = os.getenv("UPLOAD_DIR", "uploads")
