import os
import gdown
import zipfile
import logging

# Configure IDs (User: Replace with real IDs)
MURIL_ID = "FILL_MURIL_ID_HERE"
AI_DETECTOR_ID = "FILL_AI_DETECTOR_ID_HERE"

# Persistent Volume path on Railway
BASE_MODELS_DIR = "/app/models"
HATESCAN_PATH = os.path.join(BASE_MODELS_DIR, "hatescan_model")
IMAGE_MODEL_PATH = os.path.join(BASE_MODELS_DIR, "image_model")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ModelDownloader")

def download_and_extract(file_id, target_dir):
    """Downloads a zip from GDrive and extracts it to target_dir."""
    if os.path.exists(target_dir):
        logger.info(f"✅ Skipping {target_dir} - Already exists.")
        return

    logger.info(f"🚀 Downloading model to {target_dir}...")
    os.makedirs(BASE_MODELS_DIR, exist_ok=True)
    
    # Temporarily download zip
    zip_path = f"{target_dir}.zip"
    url = f"https://drive.google.com/uc?id={file_id}"
    
    try:
        gdown.download(url, zip_path, quiet=False)
        
        logger.info(f"📦 Extracting {zip_path}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(BASE_MODELS_DIR) 
        
        # Cleanup
        if os.path.exists(zip_path):
            os.remove(zip_path)
            
        logger.info(f"✨ Successfully set up {target_dir}")
    except Exception as e:
        logger.error(f"❌ Failed to download/extract {target_dir}: {e}")

def main():
    logger.info("--- 🛡️  Starting Prahari Model Deployment ---")
    
    # 1. MuRIL (Hate Speech)
    download_and_extract(MURIL_ID, HATESCAN_PATH)
    
    # 2. Swin Mixer (AI Image Detection)
    # The user referred to this as 'image_model' for Railway extraction
    download_and_extract(AI_DETECTOR_ID, IMAGE_MODEL_PATH)
    
    logger.info("--- ✅ Model setup complete ---")

if __name__ == "__main__":
    main()
