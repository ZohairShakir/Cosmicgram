import os
import torch
import logging
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from filters import contains_priority_word, is_only_safe_names

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model configuration
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "hatescan_model"))
LABELS = {0: "Not Hateful", 1: "Hateful"}
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = None
tokenizer = None
model_loaded = False

def load_hatescan_model():
    """Loads the model and tokenizer from the local directory."""
    global model, tokenizer, model_loaded
    
    logger.info(f"Attempting to load model from {MODEL_DIR}")
    
    if not os.path.exists(MODEL_DIR):
        logger.error(f"Model directory not found: {MODEL_DIR}")
        return False
        
    try:
        logger.info(f"Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        
        logger.info(f"Loading model (device: {device})...")
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
        model.to(device)
        model.eval()
        
        model_loaded = True
        logger.info("Model loaded successfully!")
        return True
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return False


def extract_trigger_phrase(inputs, input_ids):
    """
    Extracts the longest valid token to use as a 'trigger phrase'
    for highlighting in the UI. 
    """
    if tokenizer is None:
        return None
        
    try:
        tokens = tokenizer.convert_ids_to_tokens(input_ids[0])
        valid_tokens = []
        
        for token in tokens:
            if token not in ['[CLS]', '[SEP]', '[PAD]', '[UNK]']:
                # Clean up wordpiece subwords
                clean_token = token.replace('##', '')
                if len(clean_token) > 2: # Ignore very short tokens
                    valid_tokens.append(clean_token)
        
        if not valid_tokens:
            return None
            
        # Return the longest token
        return max(valid_tokens, key=len)
    except Exception as e:
        logger.warning(f"Failed to extract trigger phrase: {e}")
        return None


def classify_text(text: str):
    """Classifies text using the loaded MuRIL model."""
    if not model_loaded or model is None or tokenizer is None:
        raise RuntimeError("Model is not loaded. Cannot process request.")
        
    text_processed = text.strip().lower()
    
    # --- HYBRID LAYER PRE-CHECK ---
    # 1. False Positive Fix (Safe names like 'modi', 'rahul', etc)
    if is_only_safe_names(text_processed):
        logger.info(f"SAFE-LIST TRIGGERED: '{text_processed}'. Force Safe.")
        return {
            "label": "Not Hateful",
            "label_id": 0,
            "confidence": 100.0,
            "trigger_phrase": None,
            "is_hateful": False,
            "text_preview": text[:80]
        }

    try:
        # Tokenize
        inputs = tokenizer(
            text, 
            max_length=128, 
            truncation=True, 
            padding=True, 
            return_tensors="pt"
        )
        # Move to device
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Inference
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            
            # Apply softmax to get probabilities
            probs = torch.nn.functional.softmax(logits, dim=1)
            probs_list = probs.cpu().numpy()[0]
            
            # Get prediction
            pred_id = int(torch.argmax(probs, dim=1).item())
            confidence = float(probs_list[pred_id] * 100)
            
            # Extract trigger phrase
            trigger_phrase = extract_trigger_phrase(inputs, inputs['input_ids'])
            
            # --- HYBRID LAYER POST-CHECK ---
            # 2. False Negative Fix (Strong curses missed in sentences)
            if pred_id == 0 and contains_priority_word(text_processed):
                logger.warning(f"BLOCK-LIST TRIGGERED: '{text_processed}'. Overriding model.")
                pred_id = 1 # Force Hateful
                confidence = max(confidence, 98.5) # Boost confidence
                trigger_phrase = "Safety Triggered" if not trigger_phrase else trigger_phrase

            # Create response dictionary
            return {
                "label": LABELS[pred_id],
                "label_id": pred_id,
                "confidence": round(confidence, 2),
                "trigger_phrase": trigger_phrase,
                "is_hateful": bool(pred_id == 1),
                "text_preview": text[:80] + ("..." if len(text) > 80 else "")
            }
            
    except Exception as e:
        logger.error(f"Error during classification: {e}")
        raise e

# Try to load the model on import
load_hatescan_model()
