import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configuration
from schemas import PredictRequest, PredictResponse
from model import classify_text, model_loaded, device
from ocr import ocr_service
from image_moderator import visual_moderator

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
def classify_endpoint(request: PredictRequest):
    """
    Classifies content (text + OCR + visual) for safety.
    1. OCR Extraction (Text-in-Image) - Optimized
    2. Visual Content Analysis (Nudity, Gore, Violence)
    3. NLP Text Analysis (MuRIL)
    """
    if not model_loaded:
        logger.error("Classification attempted but model is not loaded.")
        raise HTTPException(
            status_code=503, 
            detail="The Prahari MuRIL model is currently offline. Please check logs."
        )

    # 1. OCR Extraction
    image_text = ""
    visual_results = {"is_unsafe": False, "flags": [], "confidence": 0.0}
    
    if request.image_base64:
        logger.info("Image provided, running OCR extraction...")
        # OCR (Optimized)
        image_text = ocr_service.extract_text_from_base64(request.image_base64)
        if image_text:
            stats_db["ocr_extractions"] += 1

        # 2. Visual Analysis (Nudity, Gore, etc.)
        logger.info("Running Visual Moderation (CLIP + NudeNet)...")
        visual_results = visual_moderator.analyze_image_base64(request.image_base64)
        if visual_results["is_unsafe"]:
            stats_db["visual_flags"] += 1

    # 3. Combine Text logic (Caption + OCR)
    caption_text = request.text.strip()
    fully_aggregated_text = f"{caption_text} {image_text}".strip()

    # Pre-inference check: Empty textual content but visual is unsafe
    # We still need a result object from classify_text if possible, 
    # but we can simulate a 'safe' textual result if text is empty.
    
    try:
        if fully_aggregated_text:
            # AI Inference on Text
            result = classify_text(fully_aggregated_text)
        else:
            # No text, start with a blank result
            result = {
                "label": "Not Hateful",
                "label_id": 0,
                "confidence": 0.0,
                "trigger_phrase": None,
                "is_hateful": False,
                "text_preview": ""
            }
        
        # 4. Final Aggregation
        # Flag as hateful if OCR/Caption is hateful OR if image itself is visual-unsafe
        global_unsafe = result["is_hateful"] or visual_results["is_unsafe"]
        
        # Final formatting
        final_result = {
            **result,
            "is_hateful": global_unsafe,
            "image_text": image_text if image_text else None,
            "visual_flags": visual_results["flags"],
            "is_visual_unsafe": visual_results["is_unsafe"]
        }
        
        # If visual-unsafe but text-safe, update label/confidence for UX
        if visual_results["is_unsafe"] and not result["is_hateful"]:
            final_result["label"] = "Hateful (Visual Harm)"
            final_result["label_id"] = 1
            final_result["confidence"] = max(final_result["confidence"], visual_results["confidence"])
        
        # Update stats
        stats_db["total_classified"] += 1
        if global_unsafe:
            stats_db["hateful_flags"] += 1
            logger.warning(f"CONTENT BLAGGED: TextUnsafe={result['is_hateful']}, VisualUnsafe={visual_results['is_unsafe']}")
        else:
            stats_db["safe_flags"] += 1
            
        return PredictResponse(**final_result)
        
    except Exception as e:
        logger.error(f"Error during classification: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    logger.info("Starting Prahari API server on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
