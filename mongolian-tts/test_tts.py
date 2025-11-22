import requests
import json

def test_tts(text, lang_id, filename):
    url = "http://localhost:8000/tts"
    payload = {
        "text": text,
        "language_id": lang_id
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"Testing {lang_id} with text: '{text}'...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"Success! Saved audio to {filename}")
        else:
            print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test Mongolian
    test_tts("Сайн байна уу?", "mon", "test_mon.wav")
    
    # Test English
    test_tts("Hello, how are you?", "eng", "test_eng.wav")

    # Test Thai
    test_tts("สวัสดีครับ", "tha", "test_tha.wav")

    # Test Bengali
    test_tts("আপনি কেমন আছেন?", "ben", "test_ben.wav")

    # Test Hindi
    test_tts("नमस्ते, आप कैसे हैं?", "hin", "test_hin.wav")
