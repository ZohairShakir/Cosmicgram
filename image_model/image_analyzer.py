
import torch
import clip
import requests
import numpy as np
from PIL import Image
from io import BytesIO
from nudenet import NudeDetector

NSFW_BAD_CLASSES = [
    "EXPOSED_GENITALIA_F", "EXPOSED_GENITALIA_M",
    "EXPOSED_BREAST_F", "EXPOSED_BUTTOCKS",
    "EXPOSED_ANUS", "SEXUAL_ACTIVITY"
]
VIOLENCE_LABELS = [
    "a violent image", "a gory image with blood",
    "a safe normal image", "a peaceful image"
]
HATE_LABELS = [
    "a hate symbol like swastika or KKK",
    "nazi symbol or white supremacy symbol",
    "a normal everyday image",
    "a friendly peaceful image"
]

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, clip_preprocess = clip.load("ViT-B/32", device=device)
clip_model.eval()
nude_detector = NudeDetector()

def load_image(image_input):
    if isinstance(image_input, str):
        if image_input.startswith("http"):
            response = requests.get(image_input, timeout=10)
            return Image.open(BytesIO(response.content)).convert("RGB")
        else:
            return Image.open(image_input).convert("RGB")
    return image_input.convert("RGB")

def check_nsfw(image_path):
    try:
        detections = nude_detector.detect(image_path)
        for det in detections:
            if det["class"] in NSFW_BAD_CLASSES and det["score"] > 0.5:
                return True, det["class"], round(det["score"] * 100, 1)
        return False, None, 0
    except:
        return False, None, 0

def check_clip_labels(image, labels):
    img_tensor = clip_preprocess(image).unsqueeze(0).to(device)
    text_tokens = clip.tokenize(labels).to(device)
    with torch.no_grad():
        img_features  = clip_model.encode_image(img_tensor)
        text_features = clip_model.encode_text(text_tokens)
        img_features  = img_features / img_features.norm(dim=-1, keepdim=True)
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        similarity    = (img_features @ text_features.T).squeeze(0)
        probs         = torch.softmax(similarity * 100, dim=0).cpu().numpy()
    return probs

def analyze_image(image_input):
    image = load_image(image_input)
    image.save("/tmp/check_image.jpg")
    results = {"is_safe": True, "flags": [], "details": {}}

    is_nsfw, nsfw_class, nsfw_conf = check_nsfw("/tmp/check_image.jpg")
    results["details"]["nsfw"] = {"flagged": is_nsfw, "class": nsfw_class, "confidence": nsfw_conf}
    if is_nsfw:
        results["is_safe"] = False
        results["flags"].append(f"NSFW content detected ({nsfw_class}, {nsfw_conf}%)")

    violence_probs = check_clip_labels(image, VIOLENCE_LABELS)
    violence_score = float((violence_probs[0] + violence_probs[1]) * 100)
    results["details"]["violence"] = {"flagged": violence_score > 40, "confidence": round(violence_score, 1)}
    if violence_score > 40:
        results["is_safe"] = False
        results["flags"].append(f"Violent/gore content detected ({round(violence_score,1)}%)")

    hate_probs = check_clip_labels(image, HATE_LABELS)
    hate_score = float((hate_probs[0] + hate_probs[1]) * 100)
    results["details"]["hate_symbols"] = {"flagged": hate_score > 35, "confidence": round(hate_score, 1)}
    if hate_score > 35:
        results["is_safe"] = False
        results["flags"].append(f"Hate symbol detected ({round(hate_score,1)}%)")

    results["verdict"] = "UNSAFE" if not results["is_safe"] else "SAFE"
    results["verdict_confidence"] = max(
        nsfw_conf,
        violence_score if violence_score > 40 else 0,
        hate_score if hate_score > 35 else 0
    ) if not results["is_safe"] else round(100 - max(violence_score, hate_score), 1)

    return results
