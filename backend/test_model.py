import time
from model import classify_text, load_hatescan_model, model_loaded

def test_inference():
    if not model_loaded:
        print("Model failed to load initially, attempting manual load...")
        load_hatescan_model()
        
    if not model_loaded:
        print("Error: Could not load the model from ../hatescan_model")
        return

    test_samples = [
        "This is a wonderful day to build software and learn new things.",
        "You are an absolute idiot and a complete piece of trash.",
        "I strongly disagree with your political stance on this particular issue.",
        "I will find you and murder your entire family, you disgusting pig.",
        "The food at that restaurant was terrible, 1/10 would not recommend."
    ]

    print("\n--- Running Inference Tests ---")
    for text in test_samples:
        print("-" * 50)
        print(f"Input:    '{text}'")
        
        start_t = time.time()
        try:
            result = classify_text(text)
            elapsed = (time.time() - start_t) * 1000  # ms
            
            print(f"Result:   {result['label']} (Confidence: {result['confidence']}%)")
            print(f"Trigger:  {result.get('trigger_phrase')}")
            print(f"Time:     {elapsed:.2f} ms")
        except Exception as e:
            print(f"Error during classification: {e}")

if __name__ == "__main__":
    test_inference()
