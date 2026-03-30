import os
from pathlib import Path

from dotenv import load_dotenv

# Ensure `.env` is loaded from the project root, regardless of current working directory.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")