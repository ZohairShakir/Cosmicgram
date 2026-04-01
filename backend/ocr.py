import easyocr
import base64
import numpy as np
import cv2
import logging

import re

# OCR results often contain noise; we filter out very short junk tokens
MIN_TOKEN_LEN = 3
JUNK_KEYWORDS = {'size', 'packed', 'modified', 'crc', 'file', 'folder', 'date', 'kb', 'mb', 'gb'}

logger = logging.getLogger(__name__)

def is_junk_line(text: str) -> bool:
    """Detects if a line of text is likely system metadata or table noise."""
    text_lower = text.lower()
    # Check for file system keywords
    if any(k in text_lower for k in JUNK_KEYWORDS) and len(text) < 60:
        return True
    # Check for excessive numbers (e.g., directory sizes, timestamps)
    digits = sum(c.isdigit() for c in text)
    if digits > 8 and digits / len(text) > 0.4:
        return True
    return False

class OCRService:
    def __init__(self, languages=['en', 'hi']):
        """
        Initializes the EasyOCR reader. 
        """
        logger.info(f"Initializing OCR Service for languages: {languages}")
        try:
            self.reader = easyocr.Reader(languages, gpu=True)
            logger.info("OCR Service initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize OCR: {e}")
            self.reader = None

    def extract_text_from_base64(self, base64_str: str) -> str:
        """
        Takes a base64 image string, decodes it, and runs OCR with high-speed optimizations.
        """
        if not self.reader:
            return ""

        try:
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]

            nparr = np.frombuffer(base64.b64decode(base64_str), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return ""

            # --- ENGINE SPEED OPTIMIZATION ---
            # Shrink further to 640px for maximum speed; text remains readable at this scale
            h, w = img.shape[:2]
            max_dim = 640
            if max(h, w) > max_dim:
                scale = max_dim / max(h, w)
                img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # paragraph=True is significantly faster as it groups lines in a single pass
            # x_ths/y_ths tuned for Instagram-style screenshots
            results = self.reader.readtext(gray, paragraph=True)
            
            extracted_lines = []
            for (_, text) in results:
                clean_text = text.strip()
                # Apply junk filter and length check
                if len(clean_text) >= MIN_TOKEN_LEN and not is_junk_line(clean_text):
                    extracted_lines.append(clean_text)

            full_text = " ".join(extracted_lines)
            logger.info(f"Speed-Optimized OCR Extraction complete. Length: {len(full_text)}")
            return full_text

        except Exception as e:
            logger.error(f"Error during OCR processing: {e}")
            return ""

# Singleton instance
ocr_service = OCRService()
