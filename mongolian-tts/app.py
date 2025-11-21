# app.py
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from transformers import VitsModel, AutoTokenizer
import torch
import numpy as np
import scipy.io.wavfile as wavfile
import io

app = FastAPI()

model_id = "facebook/mms-tts-mon"
device = "cuda" if torch.cuda.is_available() else "cpu"

model = VitsModel.from_pretrained(model_id).to(device)
tokenizer = AutoTokenizer.from_pretrained(model_id)

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
async def tts(req: TTSRequest):
    inputs = tokenizer(req.text, return_tensors="pt").to(device)

    with torch.no_grad():
        out = model(**inputs).waveform

    waveform = out.squeeze().cpu().numpy()
    sr = getattr(model.config, "sampling_rate", 22050)

    # Normalize float32 to int16 for WAV
    maxv = np.max(np.abs(waveform)) or 1.0
    audio_int16 = (waveform / maxv * 32767).astype(np.int16)

    buffer = io.BytesIO()
    wavfile.write(buffer, sr, audio_int16)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="audio/wav")
