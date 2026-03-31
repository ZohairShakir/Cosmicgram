import requests
import json

BASE_URL = "http://localhost:8000"

test_cases = [
    {"text": "modi", "expected": False},
    {"text": "rahul", "expected": False},
    {"text": "ali", "expected": False},
    {"text": "zohair", "expected": False},
    {"text": "bhosda", "expected": True},
    {"text": "Mujhe majdur bana rakha iski ma ka bhosda.", "expected": True},
    {"text": "This is a clean post about politics.", "expected": False}
]

def test_calibration():
    print(f"Testing Calibration for Prahari API at {BASE_URL}...")
    
    for case in test_cases:
        text = case["text"]
        expected = case["expected"]
        
        try:
            response = requests.post(
                f"{BASE_URL}/classify", 
                json={"text": text},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                is_hateful = result["is_hateful"]
                status = "PASS" if is_hateful == expected else "FAIL"
                print(f"[{status}] Input: '{text}' | Flagged: {is_hateful} | Expected: {expected}")
            else:
                print(f"[ERROR] Got status code {response.status_code} for '{text}'")
                
        except Exception as e:
            print(f"[ERROR] Failed to connect: {e}")

if __name__ == "__main__":
    test_calibration()
