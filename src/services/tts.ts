export const textToSpeech = async (text: string, apiKey?: string): Promise<string> => {
    if (!text.trim()) {
        throw new Error("Text is empty");
    }

    if (!apiKey) {
        throw new Error("Voiser API key (authCode) is required");
    }

    // Voiser API endpoint
    const endpoint = "https://api.voiser.net/v2/limitless/";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authCode: apiKey,
                articleText: text,
                configLang: "mn-MN", // Mongolian language code
                configVoice: "Mongolian Female", // Using a generic name, hoping it defaults or is correct. 
                // If specific voice names are needed, the user might need to provide it or we need to fetch list.
                // Given the search results didn't list specific names, this is the best guess.
                configPitch: "0",
                configSpeed: "1"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Voiser TTS failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Check for success status if available in response structure
        // The search result said it returns status, processing time, audio barcode, url, etc.

        if (data.AudioUrl) {
            return data.AudioUrl;
        } else if (data.url) {
            return data.url;
        } else if (data.Data && data.Data.AudioUrl) {
            return data.Data.AudioUrl;
        } else {
            // Log the full response to help debugging if it fails
            console.error("Unexpected Voiser response:", data);
            throw new Error("No audio URL found in Voiser response");
        }

    } catch (error) {
        console.error("TTS Error:", error);
        throw error;
    }
};
