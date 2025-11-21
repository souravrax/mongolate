# app.py
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from transformers import VitsModel, AutoTokenizer
import torch
import numpy as np
import scipy.io.wavfile as wavfile
import io

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

model_id = "facebook/mms-tts-mon"
device = "cuda" if torch.cuda.is_available() else "cpu"

# Lazy load the model on startup to avoid cold-start failures in some environments.
@app.on_event("startup")
def load_model():
    global model, tokenizer
    model = VitsModel.from_pretrained(model_id).to(device)
    tokenizer = AutoTokenizer.from_pretrained(model_id)

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
async def tts(req: TTSRequest):
    if not req.text or not req.text.strip():
        return {"error": "text required"}

    inputs = tokenizer(req.text, return_tensors="pt").to(device)
    with torch.no_grad():
        out = model(**inputs).waveform

    waveform = out.squeeze().cpu().numpy()
    sr = getattr(model.config, "sampling_rate", 22050)

    # normalize and convert to int16 PCM
    maxv = float(np.max(np.abs(waveform))) or 1.0
    audio_int16 = (waveform / maxv * 32767).astype(np.int16)

    buffer = io.BytesIO()
    wavfile.write(buffer, sr, audio_int16)
    buffer.seek(0)

    headers = {
        "Content-Disposition": 'attachment; filename="tts.wav"'
    }
    return StreamingResponse(buffer, media_type="audio/wav", headers=headers)
