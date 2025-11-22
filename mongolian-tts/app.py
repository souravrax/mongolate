# app.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import scipy.io.wavfile as wavfile
import io
from tts_service import TTSManager

# CORS
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(title="MMS Mongolian TTS")

# === Configure allowed origins ===
# Replace these with your real frontend origins (do NOT use ["*"] in production unless you know what you're doing)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://translator.souravrax.com",  # replace with your real domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   # or ["*"] for quick testing
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # if you want the browser to read filename header
)

# Initialize TTS Manager
tts_manager = TTSManager()

class TTSRequest(BaseModel):
    text: str
    language_id: str = Field(default="mon", description="Language ID (e.g., 'mon', 'eng')")

@app.post("/tts")
async def tts(req: TTSRequest):
    if not req.text or not req.text.strip():
        return {"error": "text required"}

    try:
        sr, audio_int16 = tts_manager.generate_audio(req.text, req.language_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    buffer = io.BytesIO()
    wavfile.write(buffer, sr, audio_int16)
    buffer.seek(0)

    headers = {
        "Content-Disposition": 'attachment; filename="tts.wav"'
    }
    return StreamingResponse(buffer, media_type="audio/wav", headers=headers)
