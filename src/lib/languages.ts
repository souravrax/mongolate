export interface Voice {
    name: string;
    label: string;
    gender: "male" | "female";
}

export interface LanguageMeta {
    id: string;
    name: string;
    flag?: string;
}

// Language metadata only — names and flags for UI display.
// Voice data comes from the backend /voices endpoint.
export const LANGUAGE_META: Record<string, { name: string; flag: string }> = {
    en: { name: "English", flag: "🇬🇧" },
    mn: { name: "Mongolian", flag: "🇲🇳" },
    zh: { name: "Chinese", flag: "🇨🇳" },
    ja: { name: "Japanese", flag: "🇯🇵" },
    ko: { name: "Korean", flag: "🇰🇷" },
    es: { name: "Spanish", flag: "🇪🇸" },
    fr: { name: "French", flag: "🇫🇷" },
    de: { name: "German", flag: "🇩🇪" },
    ru: { name: "Russian", flag: "🇷🇺" },
    ar: { name: "Arabic", flag: "🇸🇦" },
    pt: { name: "Portuguese", flag: "🇧🇷" },
    it: { name: "Italian", flag: "🇮🇹" },
    hi: { name: "Hindi", flag: "🇮🇳" },
    bn: { name: "Bengali", flag: "🇮🇳" },
    ta: { name: "Tamil", flag: "🇮🇳" },
    te: { name: "Telugu", flag: "🇮🇳" },
    ml: { name: "Malayalam", flag: "🇮🇳" },
    gu: { name: "Gujarati", flag: "🇮🇳" },
    mr: { name: "Marathi", flag: "🇮🇳" },
    pa: { name: "Punjabi", flag: "🇮🇳" },
    ur: { name: "Urdu", flag: "🇵🇰" },
    th: { name: "Thai", flag: "🇹🇭" },
    vi: { name: "Vietnamese", flag: "🇻🇳" },
    id: { name: "Indonesian", flag: "🇮🇩" },
    ms: { name: "Malay", flag: "🇲🇾" },
    fil: { name: "Filipino", flag: "🇵🇭" },
    tr: { name: "Turkish", flag: "🇹🇷" },
    uk: { name: "Ukrainian", flag: "🇺🇦" },
    pl: { name: "Polish", flag: "🇵🇱" },
    nl: { name: "Dutch", flag: "🇳🇱" },
    cs: { name: "Czech", flag: "🇨🇿" },
    sv: { name: "Swedish", flag: "🇸🇪" },
    sw: { name: "Swahili", flag: "🇰🇪" },
};

export function getLanguageName(id: string): string {
    return LANGUAGE_META[id]?.name ?? id;
}

export function getLanguageFlag(id: string): string {
    return LANGUAGE_META[id]?.flag ?? "";
}

// Hardcoded fallback voices — used until the backend responds.
// These should mirror voices.py defaults.
export const FALLBACK_VOICES: Record<string, { default: string; voices: Voice[] }> = {
    en: {
        default: "en-US-AriaNeural",
        voices: [
            { name: "en-US-AriaNeural", label: "Aria", gender: "female" },
            { name: "en-US-GuyNeural", label: "Guy", gender: "male" },
            { name: "en-US-JennyNeural", label: "Jenny", gender: "female" },
            { name: "en-US-ChristopherNeural", label: "Christopher", gender: "male" },
            { name: "en-GB-SoniaNeural", label: "Sonia (UK)", gender: "female" },
            { name: "en-GB-RyanNeural", label: "Ryan (UK)", gender: "male" },
        ],
    },
    mn: {
        default: "mn-MN-YesuiNeural",
        voices: [
            { name: "mn-MN-YesuiNeural", label: "Yesui", gender: "female" },
            { name: "mn-MN-BataaNeural", label: "Bataa", gender: "male" },
        ],
    },
    zh: {
        default: "zh-CN-XiaoxiaoNeural",
        voices: [
            { name: "zh-CN-XiaoxiaoNeural", label: "Xiaoxiao", gender: "female" },
            { name: "zh-CN-YunyangNeural", label: "Yunyang", gender: "male" },
            { name: "zh-CN-YunxiNeural", label: "Yunxi", gender: "male" },
            { name: "zh-CN-XiaoyiNeural", label: "Xiaoyi", gender: "female" },
        ],
    },
    ja: {
        default: "ja-JP-NanamiNeural",
        voices: [
            { name: "ja-JP-NanamiNeural", label: "Nanami", gender: "female" },
            { name: "ja-JP-KeitaNeural", label: "Keita", gender: "male" },
        ],
    },
    ko: {
        default: "ko-KR-SunHiNeural",
        voices: [
            { name: "ko-KR-SunHiNeural", label: "Sun-Hi", gender: "female" },
            { name: "ko-KR-InJoonNeural", label: "InJoon", gender: "male" },
        ],
    },
    es: {
        default: "es-ES-ElviraNeural",
        voices: [
            { name: "es-ES-ElviraNeural", label: "Elvira", gender: "female" },
            { name: "es-ES-AlvaroNeural", label: "Alvaro", gender: "male" },
        ],
    },
    fr: {
        default: "fr-FR-DeniseNeural",
        voices: [
            { name: "fr-FR-DeniseNeural", label: "Denise", gender: "female" },
            { name: "fr-FR-HenriNeural", label: "Henri", gender: "male" },
        ],
    },
    de: {
        default: "de-DE-KatjaNeural",
        voices: [
            { name: "de-DE-KatjaNeural", label: "Katja", gender: "female" },
            { name: "de-DE-ConradNeural", label: "Conrad", gender: "male" },
        ],
    },
    ru: {
        default: "ru-RU-SvetlanaNeural",
        voices: [
            { name: "ru-RU-SvetlanaNeural", label: "Svetlana", gender: "female" },
            { name: "ru-RU-DmitryNeural", label: "Dmitry", gender: "male" },
        ],
    },
    ar: {
        default: "ar-SA-ZariyahNeural",
        voices: [
            { name: "ar-SA-ZariyahNeural", label: "Zariyah", gender: "female" },
            { name: "ar-SA-HamedNeural", label: "Hamed", gender: "male" },
        ],
    },
    pt: {
        default: "pt-BR-FranciscaNeural",
        voices: [
            { name: "pt-BR-FranciscaNeural", label: "Francisca", gender: "female" },
            { name: "pt-BR-AntonioNeural", label: "Antonio", gender: "male" },
        ],
    },
    it: {
        default: "it-IT-ElsaNeural",
        voices: [
            { name: "it-IT-ElsaNeural", label: "Elsa", gender: "female" },
            { name: "it-IT-DiegoNeural", label: "Diego", gender: "male" },
        ],
    },
    hi: {
        default: "hi-IN-MadhurNeural",
        voices: [
            { name: "hi-IN-MadhurNeural", label: "Madhur", gender: "female" },
            { name: "hi-IN-SwaraNeural", label: "Swara", gender: "female" },
        ],
    },
    bn: {
        default: "bn-IN-TanishaaNeural",
        voices: [
            { name: "bn-IN-TanishaaNeural", label: "Tanishaa", gender: "female" },
            { name: "bn-IN-BashkarNeural", label: "Bashkar", gender: "male" },
        ],
    },
    th: {
        default: "th-TH-PremwadeeNeural",
        voices: [
            { name: "th-TH-PremwadeeNeural", label: "Premwadee", gender: "female" },
            { name: "th-TH-NiwatNeural", label: "Niwat", gender: "male" },
        ],
    },
    ta: {
        default: "ta-IN-PallaviNeural",
        voices: [
            { name: "ta-IN-PallaviNeural", label: "Pallavi", gender: "female" },
            { name: "ta-IN-ValluvarNeural", label: "Valluvar", gender: "male" },
        ],
    },
    te: {
        default: "te-IN-ShrutiNeural",
        voices: [
            { name: "te-IN-ShrutiNeural", label: "Shruti", gender: "female" },
            { name: "te-IN-MohanNeural", label: "Mohan", gender: "male" },
        ],
    },
    ml: {
        default: "ml-IN-SobhanaNeural",
        voices: [
            { name: "ml-IN-SobhanaNeural", label: "Sobhana", gender: "female" },
            { name: "ml-IN-MidhunNeural", label: "Midhun", gender: "male" },
        ],
    },
    gu: {
        default: "gu-IN-DhwaniNeural",
        voices: [
            { name: "gu-IN-DhwaniNeural", label: "Dhwani", gender: "female" },
            { name: "gu-IN-NiranjanNeural", label: "Niranjan", gender: "male" },
        ],
    },
    mr: {
        default: "mr-IN-AarohiNeural",
        voices: [
            { name: "mr-IN-AarohiNeural", label: "Aarohi", gender: "female" },
            { name: "mr-IN-ManoharNeural", label: "Manohar", gender: "male" },
        ],
    },
    pa: {
        default: "pa-IN-VeenaNeural",
        voices: [
            { name: "pa-IN-VeenaNeural", label: "Veena", gender: "female" },
            { name: "pa-IN-PrabhatNeural", label: "Prabhat", gender: "male" },
        ],
    },
    ur: {
        default: "ur-PK-UzmaNeural",
        voices: [
            { name: "ur-PK-UzmaNeural", label: "Uzma", gender: "female" },
            { name: "ur-PK-AsadNeural", label: "Asad", gender: "male" },
        ],
    },
    vi: {
        default: "vi-VN-HoaiMyNeural",
        voices: [
            { name: "vi-VN-HoaiMyNeural", label: "Hoai My", gender: "female" },
            { name: "vi-VN-NamMinhNeural", label: "Nam Minh", gender: "male" },
        ],
    },
    id: {
        default: "id-ID-GadisNeural",
        voices: [
            { name: "id-ID-GadisNeural", label: "Gadis", gender: "female" },
            { name: "id-ID-ArdiNeural", label: "Ardi", gender: "male" },
        ],
    },
    ms: {
        default: "ms-MY-YasminNeural",
        voices: [
            { name: "ms-MY-YasminNeural", label: "Yasmin", gender: "female" },
            { name: "ms-MY-OsmanNeural", label: "Osman", gender: "male" },
        ],
    },
    fil: {
        default: "fil-PH-BlessicaNeural",
        voices: [
            { name: "fil-PH-BlessicaNeural", label: "Blessica", gender: "female" },
            { name: "fil-PH-AngeloNeural", label: "Angelo", gender: "male" },
        ],
    },
    tr: {
        default: "tr-TR-EmelNeural",
        voices: [
            { name: "tr-TR-EmelNeural", label: "Emel", gender: "female" },
            { name: "tr-TR-AhmetNeural", label: "Ahmet", gender: "male" },
        ],
    },
    uk: {
        default: "uk-UA-PolinaNeural",
        voices: [
            { name: "uk-UA-PolinaNeural", label: "Polina", gender: "female" },
            { name: "uk-UA-OstapNeural", label: "Ostap", gender: "male" },
        ],
    },
    pl: {
        default: "pl-PL-AgnieszkaNeural",
        voices: [
            { name: "pl-PL-AgnieszkaNeural", label: "Agnieszka", gender: "female" },
            { name: "pl-PL-MarekNeural", label: "Marek", gender: "male" },
        ],
    },
    nl: {
        default: "nl-NL-ColetteNeural",
        voices: [
            { name: "nl-NL-ColetteNeural", label: "Colette", gender: "female" },
            { name: "nl-NL-MaartenNeural", label: "Maarten", gender: "male" },
        ],
    },
    cs: {
        default: "cs-CZ-VlastaNeural",
        voices: [
            { name: "cs-CZ-VlastaNeural", label: "Vlasta", gender: "female" },
            { name: "cs-CZ-AntoninNeural", label: "Antonin", gender: "male" },
        ],
    },
    sv: {
        default: "sv-SE-SofieNeural",
        voices: [
            { name: "sv-SE-SofieNeural", label: "Sofie", gender: "female" },
            { name: "sv-SE-MattiasNeural", label: "Mattias", gender: "male" },
        ],
    },
    sw: {
        default: "sw-KE-ZuriNeural",
        voices: [
            { name: "sw-KE-ZuriNeural", label: "Zuri", gender: "female" },
            { name: "sw-KE-RafikiNeural", label: "Rafiki", gender: "male" },
        ],
    },
};

// Build a flat lookup of all voice names
export const ALL_VOICE_NAMES = new Set<string>();
for (const data of Object.values(FALLBACK_VOICES)) {
    for (const v of data.voices) {
        ALL_VOICE_NAMES.add(v.name);
    }
}

export function getDefaultVoice(id: string): string {
    return FALLBACK_VOICES[id]?.default ?? "";
}

export function getVoiceLabel(voiceName: string): string {
    for (const data of Object.values(FALLBACK_VOICES)) {
        const v = data.voices.find((v) => v.name === voiceName);
        if (v) return v.label;
    }
    return voiceName;
}
