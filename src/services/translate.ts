export const translateText = async (
    text: string,
    sourceLang: string = "en",
    targetLang: string = "mn"
): Promise<string> => {
    if (!text.trim()) return "";

    const params = new URLSearchParams({
        client: "gtx",
        sl: sourceLang,
        tl: targetLang,
        dt: "t",
        q: text,
    });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
        credentials: "omit",
    });

    if (response.status === 429) {
        throw new Error("Google Translate is temporarily rate-limiting translation requests. Please try again later.");
    }
    if (!response.ok) {
        throw new Error(`Translation failed (${response.status}). Please try again.`);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
        throw new Error("Google Translate returned an unexpected response.");
    }

    const segments = data[0].filter(
        (segment: unknown): segment is [string, ...unknown[]] =>
            Array.isArray(segment) && typeof segment[0] === "string"
    );
    if (segments.length === 0) {
        throw new Error("Google Translate returned an empty translation.");
    }

    return segments.map((segment) => segment[0]).join("");
};
