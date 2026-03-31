from pydantic import BaseModel, Field
from typing import Optional


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=0, max_length=2048, description="Text to classify")
    image_base64: Optional[str] = Field(None, description="Optional base64 image data for OCR scanning")


class PredictResponse(BaseModel):
    label: str                        # "Not Hateful" | "Hateful"
    label_id: int                     # 0 | 1
    confidence: float                 # 0–100 percentage
    trigger_phrase: Optional[str]     # longest meaningful token, or None
    is_hateful: bool                  # convenience flag
    text_preview: str                 # first 80 chars of input
    image_text: Optional[str] = None  # extracted text from image if any
