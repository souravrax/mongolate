# app.py
import httpx
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


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"    # e.g. "en", "hi", "th"
    source_lang: str = "auto"  # auto detect by default


@app.post("/translate")
async def translate(req: TranslateRequest):
    if not req.text.strip():
        return {"error": "text required"}

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://translate.googleapis.com/translate_a/single",
                params={
                    "client": "gtx",
                    "sl": req.source_lang,
                    "tl": req.target_lang,
                    "dt": "t",
                    "q": req.text,
                },
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()

        translated = data[0][0][0]
        return {"translated": translated}

    except httpx.HTTPError as e:
        # network / HTTP issues
        raise HTTPException(status_code=502, detail=f"Translate upstream error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))