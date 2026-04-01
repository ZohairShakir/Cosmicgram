import os
import torch
import base64
from PIL import Image
from io import BytesIO
import logging
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Model path relative to backend/
LOCAL_MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "aimodel"))
RAILWAY_MODEL_PATH = "/app/models/image_model"
MODEL_PATH = RAILWAY_MODEL_PATH if os.path.exists(RAILWAY_MODEL_PATH) else LOCAL_MODEL_PATH
device = "cuda" if torch.cuda.is_available() else "cpu"
logger = logging.getLogger(__name__)

class AIDetector:
    def __init__(self):
        """Initializes the Swin AI detection model from local files."""
        logger.info(f"Loading AI detector from {MODEL_PATH}")
        try:
            self.processor = AutoImageProcessor.from_pretrained(MODEL_PATH)
            self.model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)
            self.model.to(device)
            self.model.eval()
            logger.info("AI Detector model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load AI Detector: {e}")
            self.model = None

    def detect_ai_image(self, base64_str: str) -> bool:
        """Runs the Swin model. Returns True if the image is classified as 'artificial'."""
        if not self.model:
            return False

        try:
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]
            img_data = base64.b64decode(base64_str)
            pil_img = Image.open(BytesIO(img_data)).convert("RGB")

            # Preprocess and inference
            inputs = self.processor(images=pil_img, return_tensors="pt").to(device)
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                predicted_idx = int(torch.argmax(logits, dim=1).item())
                
                # Robust mapping check: handles both string and int keys (Transformers version dependent)
                id2label = self.model.config.id2label
                label = id2label.get(predicted_idx, id2label.get(str(predicted_idx), "human")).lower()
                
                is_ai = (label == "artificial")
                logger.info(f"AI Detection Result: label={label}, index={predicted_idx}, is_ai={is_ai}")
                return is_ai

        except Exception as e:
            logger.error(f"AI Detection Inference failed: {e}")
            return False

# Singleton instance
ai_detector = AIDetector()
