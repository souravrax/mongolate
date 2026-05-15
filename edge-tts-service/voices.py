"""
Voice database for MS Edge TTS.
Each language maps to its default voice and a list of available voices.
"""

VOICES = {
    "en": {
        "default": "en-US-AriaNeural",
        "voices": [
            {"name": "en-US-AriaNeural", "label": "Aria (Female)", "gender": "female"},
            {"name": "en-US-GuyNeural", "label": "Guy (Male)", "gender": "male"},
            {"name": "en-US-JennyNeural", "label": "Jenny (Female)", "gender": "female"},
            {"name": "en-US-ChristopherNeural", "label": "Christopher (Male)", "gender": "male"},
            {"name": "en-GB-SoniaNeural", "label": "Sonia (Female, UK)", "gender": "female"},
            {"name": "en-GB-RyanNeural", "label": "Ryan (Male, UK)", "gender": "male"},
        ],
    },
    "mn": {
        "default": "mn-MN-YesuiNeural",
        "voices": [
            {"name": "mn-MN-YesuiNeural", "label": "Yesui (Female)", "gender": "female"},
            {"name": "mn-MN-BataaNeural", "label": "Bataa (Male)", "gender": "male"},
        ],
    },
    "zh": {
        "default": "zh-CN-XiaoxiaoNeural",
        "voices": [
            {"name": "zh-CN-XiaoxiaoNeural", "label": "Xiaoxiao (Female)", "gender": "female"},
            {"name": "zh-CN-YunyangNeural", "label": "Yunyang (Male)", "gender": "male"},
            {"name": "zh-CN-YunxiNeural", "label": "Yunxi (Male)", "gender": "male"},
            {"name": "zh-CN-XiaoyiNeural", "label": "Xiaoyi (Female)", "gender": "female"},
        ],
    },
    "ja": {
        "default": "ja-JP-NanamiNeural",
        "voices": [
            {"name": "ja-JP-NanamiNeural", "label": "Nanami (Female)", "gender": "female"},
            {"name": "ja-JP-KeitaNeural", "label": "Keita (Male)", "gender": "male"},
        ],
    },
    "ko": {
        "default": "ko-KR-SunHiNeural",
        "voices": [
            {"name": "ko-KR-SunHiNeural", "label": "Sun-Hi (Female)", "gender": "female"},
            {"name": "ko-KR-InJoonNeural", "label": "InJoon (Male)", "gender": "male"},
        ],
    },
    "es": {
        "default": "es-ES-ElviraNeural",
        "voices": [
            {"name": "es-ES-ElviraNeural", "label": "Elvira (Female)", "gender": "female"},
            {"name": "es-ES-AlvaroNeural", "label": "Alvaro (Male)", "gender": "male"},
        ],
    },
    "fr": {
        "default": "fr-FR-DeniseNeural",
        "voices": [
            {"name": "fr-FR-DeniseNeural", "label": "Denise (Female)", "gender": "female"},
            {"name": "fr-FR-HenriNeural", "label": "Henri (Male)", "gender": "male"},
        ],
    },
    "de": {
        "default": "de-DE-KatjaNeural",
        "voices": [
            {"name": "de-DE-KatjaNeural", "label": "Katja (Female)", "gender": "female"},
            {"name": "de-DE-ConradNeural", "label": "Conrad (Male)", "gender": "male"},
        ],
    },
    "ru": {
        "default": "ru-RU-SvetlanaNeural",
        "voices": [
            {"name": "ru-RU-SvetlanaNeural", "label": "Svetlana (Female)", "gender": "female"},
            {"name": "ru-RU-DmitryNeural", "label": "Dmitry (Male)", "gender": "male"},
        ],
    },
    "ar": {
        "default": "ar-SA-ZariyahNeural",
        "voices": [
            {"name": "ar-SA-ZariyahNeural", "label": "Zariyah (Female)", "gender": "female"},
            {"name": "ar-SA-HamedNeural", "label": "Hamed (Male)", "gender": "male"},
        ],
    },
    "pt": {
        "default": "pt-BR-FranciscaNeural",
        "voices": [
            {"name": "pt-BR-FranciscaNeural", "label": "Francisca (Female)", "gender": "female"},
            {"name": "pt-BR-AntonioNeural", "label": "Antonio (Male)", "gender": "male"},
        ],
    },
    "it": {
        "default": "it-IT-ElsaNeural",
        "voices": [
            {"name": "it-IT-ElsaNeural", "label": "Elsa (Female)", "gender": "female"},
            {"name": "it-IT-DiegoNeural", "label": "Diego (Male)", "gender": "male"},
        ],
    },
    "hi": {
        "default": "hi-IN-MadhurNeural",
        "voices": [
            {"name": "hi-IN-MadhurNeural", "label": "Madhur (Female)", "gender": "female"},
            {"name": "hi-IN-SwaraNeural", "label": "Swara (Female)", "gender": "female"},
        ],
    },
    "bn": {
        "default": "bn-IN-TanishaaNeural",
        "voices": [
            {"name": "bn-IN-TanishaaNeural", "label": "Tanishaa (Female)", "gender": "female"},
            {"name": "bn-IN-BashkarNeural", "label": "Bashkar (Male)", "gender": "male"},
        ],
    },
    "th": {
        "default": "th-TH-PremwadeeNeural",
        "voices": [
            {"name": "th-TH-PremwadeeNeural", "label": "Premwadee (Female)", "gender": "female"},
            {"name": "th-TH-NiwatNeural", "label": "Niwat (Male)", "gender": "male"},
        ],
    },
    "ta": {
        "default": "ta-IN-PallaviNeural",
        "voices": [
            {"name": "ta-IN-PallaviNeural", "label": "Pallavi (Female)", "gender": "female"},
            {"name": "ta-IN-ValluvarNeural", "label": "Valluvar (Male)", "gender": "male"},
        ],
    },
    "te": {
        "default": "te-IN-ShrutiNeural",
        "voices": [
            {"name": "te-IN-ShrutiNeural", "label": "Shruti (Female)", "gender": "female"},
            {"name": "te-IN-MohanNeural", "label": "Mohan (Male)", "gender": "male"},
        ],
    },
    "ml": {
        "default": "ml-IN-SobhanaNeural",
        "voices": [
            {"name": "ml-IN-SobhanaNeural", "label": "Sobhana (Female)", "gender": "female"},
            {"name": "ml-IN-MidhunNeural", "label": "Midhun (Male)", "gender": "male"},
        ],
    },
    "gu": {
        "default": "gu-IN-DhwaniNeural",
        "voices": [
            {"name": "gu-IN-DhwaniNeural", "label": "Dhwani (Female)", "gender": "female"},
            {"name": "gu-IN-NiranjanNeural", "label": "Niranjan (Male)", "gender": "male"},
        ],
    },
    "mr": {
        "default": "mr-IN-AarohiNeural",
        "voices": [
            {"name": "mr-IN-AarohiNeural", "label": "Aarohi (Female)", "gender": "female"},
            {"name": "mr-IN-ManoharNeural", "label": "Manohar (Male)", "gender": "male"},
        ],
    },
    "pa": {
        "default": "pa-IN-VeenaNeural",
        "voices": [
            {"name": "pa-IN-VeenaNeural", "label": "Veena (Female)", "gender": "female"},
            {"name": "pa-IN-PrabhatNeural", "label": "Prabhat (Male)", "gender": "male"},
        ],
    },
    "ur": {
        "default": "ur-PK-UzmaNeural",
        "voices": [
            {"name": "ur-PK-UzmaNeural", "label": "Uzma (Female)", "gender": "female"},
            {"name": "ur-PK-AsadNeural", "label": "Asad (Male)", "gender": "male"},
        ],
    },
    "vi": {
        "default": "vi-VN-HoaiMyNeural",
        "voices": [
            {"name": "vi-VN-HoaiMyNeural", "label": "Hoai My (Female)", "gender": "female"},
            {"name": "vi-VN-NamMinhNeural", "label": "Nam Minh (Male)", "gender": "male"},
        ],
    },
    "id": {
        "default": "id-ID-GadisNeural",
        "voices": [
            {"name": "id-ID-GadisNeural", "label": "Gadis (Female)", "gender": "female"},
            {"name": "id-ID-ArdiNeural", "label": "Ardi (Male)", "gender": "male"},
        ],
    },
    "ms": {
        "default": "ms-MY-YasminNeural",
        "voices": [
            {"name": "ms-MY-YasminNeural", "label": "Yasmin (Female)", "gender": "female"},
            {"name": "ms-MY-OsmanNeural", "label": "Osman (Male)", "gender": "male"},
        ],
    },
    "fil": {
        "default": "fil-PH-BlessicaNeural",
        "voices": [
            {"name": "fil-PH-BlessicaNeural", "label": "Blessica (Female)", "gender": "female"},
            {"name": "fil-PH-AngeloNeural", "label": "Angelo (Male)", "gender": "male"},
        ],
    },
    "tr": {
        "default": "tr-TR-EmelNeural",
        "voices": [
            {"name": "tr-TR-EmelNeural", "label": "Emel (Female)", "gender": "female"},
            {"name": "tr-TR-AhmetNeural", "label": "Ahmet (Male)", "gender": "male"},
        ],
    },
    "uk": {
        "default": "uk-UA-PolinaNeural",
        "voices": [
            {"name": "uk-UA-PolinaNeural", "label": "Polina (Female)", "gender": "female"},
            {"name": "uk-UA-OstapNeural", "label": "Ostap (Male)", "gender": "male"},
        ],
    },
    "pl": {
        "default": "pl-PL-AgnieszkaNeural",
        "voices": [
            {"name": "pl-PL-AgnieszkaNeural", "label": "Agnieszka (Female)", "gender": "female"},
            {"name": "pl-PL-MarekNeural", "label": "Marek (Male)", "gender": "male"},
        ],
    },
    "nl": {
        "default": "nl-NL-ColetteNeural",
        "voices": [
            {"name": "nl-NL-ColetteNeural", "label": "Colette (Female)", "gender": "female"},
            {"name": "nl-NL-MaartenNeural", "label": "Maarten (Male)", "gender": "male"},
        ],
    },
    "cs": {
        "default": "cs-CZ-VlastaNeural",
        "voices": [
            {"name": "cs-CZ-VlastaNeural", "label": "Vlasta (Female)", "gender": "female"},
            {"name": "cs-CZ-AntoninNeural", "label": "Antonin (Male)", "gender": "male"},
        ],
    },
    "sv": {
        "default": "sv-SE-SofieNeural",
        "voices": [
            {"name": "sv-SE-SofieNeural", "label": "Sofie (Female)", "gender": "female"},
            {"name": "sv-SE-MattiasNeural", "label": "Mattias (Male)", "gender": "male"},
        ],
    },
    "sw": {
        "default": "sw-KE-ZuriNeural",
        "voices": [
            {"name": "sw-KE-ZuriNeural", "label": "Zuri (Female)", "gender": "female"},
            {"name": "sw-KE-RafikiNeural", "label": "Rafiki (Male)", "gender": "male"},
        ],
    },
}

# Flat lookup for quick validation
ALL_VOICE_NAMES = set()
for lang_data in VOICES.values():
    for v in lang_data["voices"]:
        ALL_VOICE_NAMES.add(v["name"])
