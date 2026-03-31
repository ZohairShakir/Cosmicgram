import os
import torch
from transformers import CLIPProcessor, CLIPModel
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import logging
from nudenet import NudeDetector

# Configuration
device = "cuda" if torch.cuda.is_available() else "cpu"
logger = logging.getLogger(__name__)

# CLIP Content Labels for Violence/Hate/Gore
VIOLENCE_LABELS = [
    "a violent image with blood and gore", 
    "a photo of a weapon or crime scene",
    "a safe and normal peaceful image"
]

HATE_LABELS = [
    "a hate symbol like a swastika or extremist symbol",
    "a photo of a political rally with hate flags",
    "a normal everyday object or landscape"
]

# NudeNet classes to flag (60% + confidence for NSFW)
NSFW_BAD_CLASSES = [
    "EXPOSED_GENITALIA_F", "EXPOSED_GENITALIA_M",
    "EXPOSED_BREAST_F", "EXPOSED_BUTTOCKS",
    "EXPOSED_ANUS", "SEXUAL_ACTIVITY"
]

class VisualModerator:
    def __init__(self):
        """
        Initializes CLIP (via Transformers) and NudeNet models.
        """
        logger.info(f"Initializing Visual Moderator on device: {device}")
        try:
            # CLIP (HuggingFace Transformers version)
            self.model_id = "openai/clip-vit-base-patch32"
            self.clip_model = CLIPModel.from_pretrained(self.model_id).to(device)
            self.clip_processor = CLIPProcessor.from_pretrained(self.model_id)
            self.clip_model.eval()
            
            # NudeNet
            self.nude_detector = NudeDetector()
            logger.info("Visual Moderation models loaded successfully via Transformers.")
        except Exception as e:
            logger.error(f"Failed to load visual models: {e}")
            self.clip_model = None

    def _get_clip_score(self, pil_image, labels):
        """Calculates softmax distribution of labels for an image using Transformers CLIP."""
        if not self.clip_model:
            return None
            
        try:
            inputs = self.clip_processor(text=labels, images=pil_image, return_tensors="pt", padding=True).to(device)
            
            with torch.no_grad():
                outputs = self.clip_model(**inputs)
                logits_per_image = outputs.logits_per_image # this is the image-text similarity score
                probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]
                
            return probs
        except Exception as e:
            logger.error(f"CLIP Inference failed: {e}")
            return None

    def analyze_image_base64(self, base64_str: str):
        """
        Checks image for Nudity (NudeNet) and Violence/Gore (CLIP).
        Returns a dict with safety verdict.
        """
        results = {"is_unsafe": False, "flags": [], "confidence": 0.0}
        
        try:
            # Decode and convert to PIL
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]
            img_data = base64.b64decode(base64_str)
            pil_img = Image.open(BytesIO(img_data)).convert("RGB")
            
            # Temporary save for NudeNet (it prefers file paths)
            temp_path = "tmp_scan.jpg"
            pil_img.save(temp_path)
            
            # 1. Check NSFW (NudeNet)
            detections = self.nude_detector.detect(temp_path)
            for det in detections:
                if det["class"] in NSFW_BAD_CLASSES and det["score"] > 0.6:
                    results["is_unsafe"] = True
                    results["flags"].append(f"NSFW content: {det['class']}")
                    results["confidence"] = max(results["confidence"], det["score"] * 100)

            # 2. Check Violence/Gore (CLIP)
            violence_probs = self._get_clip_score(pil_img, VIOLENCE_LABELS)
            if violence_probs is not None:
                # Combined score for first two labels (violence/weapons)
                v_score = (violence_probs[0] + violence_probs[1]) * 100
                if v_score > 60: # Calibrated for Transformers CLIP
                    results["is_unsafe"] = True
                    results["flags"].append("Violent or Gore content")
                    results["confidence"] = max(results["confidence"], v_score)

            # 3. Check Hate Symbols (CLIP)
            hate_probs = self._get_clip_score(pil_img, HATE_LABELS)
            if hate_probs is not None:
                h_score = (hate_probs[0] + hate_probs[1]) * 100
                if h_score > 55:
                    results["is_unsafe"] = True
                    results["flags"].append("Hate symbols or extremist iconography")
                    results["confidence"] = max(results["confidence"], h_score)

            # Cleanup
            if os.path.exists(temp_path):
                os.remove(temp_path)

            return results
        except Exception as e:
            logger.error(f"Visual Moderation failed: {e}")
            return results

# Singleton instance
visual_moderator = VisualModerator()
