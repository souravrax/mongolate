export const textToSpeech = async (text: string, languageId: string = "mon"): Promise<string> => {
    if (!text.trim()) {
        throw new Error("Text is empty");
    }

    // Custom TTS endpoint
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const endpoint = `${baseUrl}/tts`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                language_id: languageId
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TTS failed: ${response.status} - ${errorText}`);
        }

        // Get the audio data as a blob
        const blob = await response.blob();
        // Create a URL for the blob
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("TTS Error:", error);
        throw error;
    }
};
