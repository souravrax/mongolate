# ms-edge-tts-app.py
import io
import httpx
import edge_tts
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from starlette.middleware.cors import CORSMiddleware

app = FastAPI(title="MS Edge TTS")

# === Configure allowed origins ===
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://translator.souravrax.com",
    "https://mongolate.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS", "GET"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Map language IDs to MS Edge TTS neural voices
VOICE_MAP = {
    "mon": "mn-MN-YesuiNeural",
    "mn":  "mn-MN-YesuiNeural",
    "eng": "en-US-AriaNeural",
    "en":  "en-US-AriaNeural",
    "tha": "th-TH-PremwadeeNeural",
    "th":  "th-TH-PremwadeeNeural",
    "ben": "bn-IN-TanishaaNeural",
    "bn":  "bn-IN-TanishaaNeural",
    "hin": "hi-IN-MadhurNeural",
    "hi":  "hi-IN-MadhurNeural",
}


@app.get("/")
async def root():
    return {"message": "MS Edge TTS API is running"}


class TTSRequest(BaseModel):
    text: str
    language_id: str = Field(default="mon", description="Language ID (e.g., 'mon', 'eng')")


@app.post("/tts")
async def tts(req: TTSRequest):
    if not req.text or not req.text.strip():
        return {"error": "text required"}

    voice = VOICE_MAP.get(req.language_id.lower())
    if not voice:
        raise HTTPException(
            status_code=400,
            detail=f"Language '{req.language_id}' is not supported."
        )

    try:
        communicate = edge_tts.Communicate(req.text, voice)
        buffer = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                buffer.write(chunk["data"])
        buffer.seek(0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    headers = {
        "Content-Disposition": 'attachment; filename="tts.mp3"'
    }
    return StreamingResponse(buffer, media_type="audio/mpeg", headers=headers)


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"
    source_lang: str = "auto"


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

        # Google Translate returns segments as data[0] = [[translated, original, ...], ...]
        # Join all translated segments, preserving newlines from the original structure
        segments = []
        for item in data[0]:
            if isinstance(item, list) and len(item) > 0:
                segments.append(item[0])
        translated = "".join(segments)
        return {"translated": translated}

    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Translate upstream error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
