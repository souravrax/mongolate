import torch
import numpy as np
from transformers import VitsModel, AutoTokenizer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TTSManager:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}
        self.tokenizers = {}
        self.supported_languages = {
            "mon": "facebook/mms-tts-mon",
            "eng": "facebook/mms-tts-eng",
            "tha": "facebook/mms-tts-tha",
            "ben": "facebook/mms-tts-ben",
            "hin": "facebook/mms-tts-hin"
        }
        logger.info(f"TTSManager initialized on device: {self.device}")

    def _load_model(self, lang_id: str):
        """
        Loads the model and tokenizer for the specified language if not already loaded.
        """
        if lang_id not in self.supported_languages:
            raise ValueError(f"Language '{lang_id}' is not supported.")

        if lang_id not in self.models:
            model_id = self.supported_languages[lang_id]
            logger.info(f"Loading model for language: {lang_id} ({model_id})")
            try:
                self.models[lang_id] = VitsModel.from_pretrained(model_id).to(self.device)
                self.tokenizers[lang_id] = AutoTokenizer.from_pretrained(model_id)
                logger.info(f"Successfully loaded model for {lang_id}")
            except Exception as e:
                logger.error(f"Failed to load model for {lang_id}: {e}")
                raise e

    def generate_audio(self, text: str, lang_id: str):
        """
        Generates audio waveform for the given text and language.
        Returns:
            tuple: (sampling_rate, audio_int16_array)
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        self._load_model(lang_id)
        
        model = self.models[lang_id]
        tokenizer = self.tokenizers[lang_id]

        inputs = tokenizer(text, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            out = model(**inputs).waveform

        waveform = out.squeeze().cpu().numpy()
        sr = getattr(model.config, "sampling_rate", 22050)

        # Normalize and convert to int16 PCM
        maxv = float(np.max(np.abs(waveform))) or 1.0
        audio_int16 = (waveform / maxv * 32767).astype(np.int16)

        return sr, audio_int16

    def get_supported_languages(self):
        return list(self.supported_languages.keys())
