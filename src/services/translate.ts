export interface TranslationResponse {
    translated: string;
}

export const translateText = async (text: string, sourceLang: string = "en", targetLang: string = "mn"): Promise<string> => {
    if (!text.trim()) return "";

    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseUrl) {
            throw new Error("VITE_ENV is not defined");
        }

        const response = await fetch(`${baseUrl}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang,
                source_lang: sourceLang
            })
        });

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data: TranslationResponse = await response.json();

        return data.translated;

    } catch (error) {
        console.error("Translation Error:", error);
        throw error;
    }
};
