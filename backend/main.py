import logging
import warnings
import torch
import asyncio
import os
import subprocess

# --- RAILWAY PERSISTENT VOLUME CHECK ---
# If model is missing in /app/models/, trigger the downloader
RAILWAY_MODEL_PATH = "/app/models/hatescan_model"
if not os.path.exists(RAILWAY_MODEL_PATH) and os.environ.get("RAILWAY_ENVIRONMENT"):
    print("🚀 Missing models in Railway Volume. Triggering download_models.py...")
    try:
        subprocess.run(["python", "download_models.py"], check=True)
    except Exception as e:
        print(f"❌ Failed to trigger model download: {e}")

# Filter out verbose library warnings (e.g. PyTorch pin_memory warnings)
warnings.filterwarnings("ignore", category=UserWarning)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configuration
from schemas import PredictRequest, PredictResponse
from model import classify_text, model_loaded, device
from ocr import ocr_service
from image_moderator import visual_moderator
from ai_detector import ai_detector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Prahari API",
    description="Multi-Modal Social Moderation (Text + OCR + Visual Safety)",
    version="3.0.0"
)

# ... (middleware and stats_db)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stats_db = {
    "total_classified": 0,
    "hateful_flags": 0,
    "safe_flags": 0,
    "ocr_extractions": 0,
    "visual_flags": 0
}


@app.get("/health")
def get_health():
    """Healthcheck endpoint to verify the API and AI model state."""
    return {
        "status": "online",
        "model_loaded": model_loaded,
        "device": str(device)
    }


@app.get("/stats")
def get_stats():
    """Returns the current traffic stats for the session."""
    return stats_db


@app.post("/classify", response_model=PredictResponse)
async def classify_endpoint(request: PredictRequest):
    """
    Classifies content using a High-Parallel Multi-Modal Architecture.
    OCR, Visual Moderation, and AI Detection now run in parallel.
    """
    if not model_loaded:
        logger.error("Classification attempted but model is not loaded.")
        raise HTTPException(
            status_code=503, 
            detail="The Prahari MuRIL model is currently offline. Please check logs."
        )

    # 1. Parallel Image Execution
    # By running these in 'asyncio.to_thread', we avoid blocking the event loop.
    if request.image_base64:
        logger.info("⚡ Starting Parallel Image Analysis (OCR + Visual + AI Detector)...")
        
        # Dispatch all vision-based models simultaneously
        tasks = [
            asyncio.to_thread(ocr_service.extract_text_from_base64, request.image_base64),
            asyncio.to_thread(visual_moderator.analyze_image_base64, request.image_base64),
            asyncio.to_thread(ai_detector.detect_ai_image, request.image_base64)
        ]
        
        # Await results in batch
        image_text, visual_results, is_ai_generated = await asyncio.gather(*tasks)
        
        if image_text: stats_db["ocr_extractions"] += 1
        if visual_results["is_unsafe"]: stats_db["visual_flags"] += 1

    # 2. Decision Logic: Classify Text Sources Independently
    caption_text = request.text.strip()
    
    try:
        # Offload textual AI checks to threads as well
        txt_tasks = []
        if caption_text:
            txt_tasks.append(asyncio.to_thread(classify_text, caption_text))
        else:
            txt_tasks.append(asyncio.sleep(0, result={"is_hateful": False, "label": "Not Hateful", "confidence": 0.0}))

        if image_text:
            txt_tasks.append(asyncio.to_thread(classify_text, image_text))
        else:
            txt_tasks.append(asyncio.sleep(0, result={"is_hateful": False, "label": "Not Hateful", "confidence": 0.0}))

        # Run text analyses (MuRIL)
        res_caption, res_ocr = await asyncio.gather(*txt_tasks)

        # 3. Global Aggregation
        global_unsafe = res_caption["is_hateful"] or res_ocr["is_hateful"] or visual_results["is_unsafe"]
        
        all_results = [res_caption, res_ocr]
        if visual_results["is_unsafe"]:
            all_results.append({
                "label": "Hateful (Visual Harm)",
                "confidence": visual_results["confidence"],
                "is_hateful": True
            })
            
        final_winner = max(all_results, key=lambda x: x["confidence"] if x["is_hateful"] else 0)

        # Prepare Response
        return_image_text = image_text if res_ocr["is_hateful"] else None
        
        final_response = {
            "label": final_winner["label"],
            "label_id": 1 if global_unsafe else 0,
            "confidence": round(float(final_winner["confidence"]), 2),
            "trigger_phrase": res_caption.get("trigger_phrase") if res_caption["is_hateful"] else res_ocr.get("trigger_phrase"),
            "is_hateful": global_unsafe,
            "text_preview": caption_text[:80],
            "image_text": return_image_text,
            "visual_flags": visual_results["flags"],
            "is_visual_unsafe": visual_results["is_unsafe"],
            "is_ai_generated": is_ai_generated
        }
        
        # Update stats
        stats_db["total_classified"] += 1
        if global_unsafe:
            stats_db["hateful_flags"] += 1
        else:
            stats_db["safe_flags"] += 1
            
        return PredictResponse(**final_response)
        
    except Exception as e:
        logger.error(f"Error during classification: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    logger.info("Starting Prahari API server on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
