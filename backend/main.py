import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configuration
from schemas import PredictRequest, PredictResponse
from model import classify_text, model_loaded, device
from ocr import ocr_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Prahari API",
    description="MuRIL-based Content Moderation and Harmful Content Detection",
    version="2.5.0"
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
    "ocr_extractions": 0
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
def classify_endpoint(request: PredictRequest):
    """
    Classifies content (text + optional image). 
    1. Extracts text from image via OCR if provided.
    2. Aggregates text sources.
    3. Runs inference through the MuRIL NLP model.
    """
    if not model_loaded:
        logger.error("Classification attempted but model is not loaded.")
        raise HTTPException(
            status_code=503, 
            detail="The Prahari MuRIL model is currently offline. Please check logs."
        )

    # 1. OCR Extraction
    image_text = ""
    if request.image_base64:
        logger.info("Image provided, running OCR extraction...")
        image_text = ocr_service.extract_text_from_base64(request.image_base64)
        if image_text:
            stats_db["ocr_extractions"] += 1

    # 2. Combine Text
    caption_text = request.text.strip()
    fully_aggregated_text = f"{caption_text} {image_text}".strip()

    if not fully_aggregated_text:
        raise HTTPException(
            status_code=400, 
            detail="No content to classify. Please providing a caption or an image with text."
        )

    try:
        # 3. Model Classification
        result = classify_text(fully_aggregated_text)
        
        # Add image text info to result
        result["image_text"] = image_text if image_text else None
        
        # Update our stats
        stats_db["total_classified"] += 1
        if result["is_hateful"]:
            stats_db["hateful_flags"] += 1
            logger.warning(f"CONTENT FLAGGED: {fully_aggregated_text[:50]}")
        else:
            stats_db["safe_flags"] += 1
            
        return PredictResponse(**result)
        
    except Exception as e:
        logger.error(f"Error during classification: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    logger.info("Starting Prahari API server on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
