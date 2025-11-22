export interface TranslationResponse {
    responseData: {
        translatedText: string;
        match: number;
    };
    responseStatus: number;
    responderId: string | null;
    exception_code: string | null;
    matches: Array<{
        id: string;
        segment: string;
        translation: string;
        source: string;
        target: string;
        quality: number;
        reference: string | null;
        "usage-count": number;
        subject: string;
        "created-by": string;
        "last-updated-by": string;
        "create-date": string;
        "last-update-date": string;
        match: number;
    }>;
}

const MYMEMORY_DE = import.meta.env.VITE_MYMEMORY_DE;

export const translateText = async (text: string, sourceLang: string = "en", targetLang: string = "mn"): Promise<string> => {
    if (!text.trim()) return "";

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                text
            )}&langpair=${sourceLang}|${targetLang}&de=${MYMEMORY_DE}`
        );

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data: TranslationResponse = await response.json();

        if (data.responseStatus !== 200) {
            // MyMemory sometimes returns 403 or other codes in responseStatus even if HTTP is 200
            throw new Error(data.responseData.translatedText || "Translation error");
        }

        return data.responseData.translatedText;
    } catch (error) {
        console.error("Translation Error:", error);
        throw error;
    }
};
