# ms-edge-tts-app.py
import io
import httpx
import edge_tts
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from starlette.middleware.cors import CORSMiddleware

from voices import VOICES, ALL_VOICE_NAMES

app = FastAPI(title="MS Edge TTS")
router = APIRouter()

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


def resolve_voice(language_id: str, voice: str | None = None) -> str:
    """Resolve a language_id + optional voice name into a valid voice string."""
    lang = language_id.lower()
    if lang == "mon":
        lang = "mn"
    lang_data = VOICES.get(lang)
    if not lang_data:
        raise HTTPException(
            status_code=400,
            detail=f"Language '{language_id}' is not supported."
        )

    if voice:
        voice_name = voice.strip()
        if voice_name in ALL_VOICE_NAMES:
            return voice_name
        raise HTTPException(
            status_code=400,
            detail=f"Voice '{voice}' is not supported."
        )

    return lang_data["default"]


@router.get("/")
async def root():
    return {"message": "MS Edge TTS API is running"}


@router.get("/voices")
async def list_all_voices():
    """Return all supported languages with their available voices."""
    return {
        lang_id: {
            "default": data["default"],
            "voices": data["voices"],
        }
        for lang_id, data in VOICES.items()
    }


@router.get("/voices/{language_id}")
async def list_language_voices(language_id: str):
    """Return voices for a specific language."""
    lang = language_id.lower()
    data = VOICES.get(lang)
    if not data:
        raise HTTPException(
            status_code=400,
            detail=f"Language '{language_id}' is not supported."
        )
    return {
        "language_id": lang,
        "default": data["default"],
        "voices": data["voices"],
    }


class TTSRequest(BaseModel):
    text: str
    language_id: str = Field(default="mn", description="Language ID (e.g., 'en', 'mn')")
    voice: str | None = Field(default=None, description="Optional voice name (e.g., 'en-US-GuyNeural')")


@router.post("/tts")
async def tts(req: TTSRequest):
    if not req.text or not req.text.strip():
        return {"error": "text required"}

    voice = resolve_voice(req.language_id, req.voice)

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


@router.get("/tts/stream")
async def tts_stream(
    text: str,
    language_id: str = "mn",
    voice: str | None = None,
):
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="text required")

    resolved_voice = resolve_voice(language_id, voice)

    try:
        communicate = edge_tts.Communicate(text, resolved_voice)

        async def generate():
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    yield chunk["data"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return StreamingResponse(generate(), media_type="audio/mpeg")


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"
    source_lang: str = "auto"


@router.post("/translate")
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

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            headers = {}
            retry_after = e.response.headers.get("Retry-After")
            if retry_after:
                headers["Retry-After"] = retry_after
            raise HTTPException(
                status_code=429,
                detail="Google Translate is temporarily rate-limiting translation requests. Please try again later.",
                headers=headers,
            ) from e
        raise HTTPException(status_code=502, detail="The translation service returned an error.") from e
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail="Could not reach the translation service.") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(router)
app.include_router(router, prefix="/api", include_in_schema=False)
