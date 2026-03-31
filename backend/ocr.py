import easyocr
import base64
import numpy as np
import cv2
import logging

# OCR results often contain noise; we filter out very short junk tokens
MIN_TOKEN_LEN = 3

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self, languages=['en', 'hi']):
        """
        Initializes the EasyOCR reader. 
        Will download weights (10-20MB) on first run if not present.
        """
        logger.info(f"Initializing OCR Service for languages: {languages}")
        try:
            self.reader = easyocr.Reader(languages, gpu=True)
            logger.info("OCR Service initialized successfully (GPU enabled if available).")
        except Exception as e:
            logger.error(f"Failed to initialize OCR: {e}")
            self.reader = None

    def extract_text_from_base64(self, base64_str: str) -> str:
        """
        Takes a base64 image string, decodes it, and runs OCR.
        Returns a single string of concatenated text.
        """
        if not self.reader:
            logger.warning("OCR Reader not available. Skipping image extraction.")
            return ""

        try:
            # Strip metadata prefix if present (e.g., data:image/jpeg;base64,)
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]

            # Decode
            nparr = np.frombuffer(base64.b64decode(base64_str), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                logger.error("Failed to decode image from base64.")
                return ""

            # Run OCR
            results = self.reader.readtext(img)
            
            # results is a list of tuples: (bbox, text, confidence)
            # We filter for confidence and length
            extracted_tokens = []
            for (_, text, prob) in results:
                if prob > 0.3 and len(text.strip()) >= MIN_TOKEN_LEN:
                    extracted_tokens.append(text.strip())

            full_text = " ".join(extracted_tokens)
            logger.info(f"Extracted OCR text: {full_text[:100]}...")
            return full_text

        except Exception as e:
            logger.error(f"Error during OCR processing: {e}")
            return ""

# Singleton instance
ocr_service = OCRService()
