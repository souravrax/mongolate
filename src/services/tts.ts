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

export function streamTextToSpeech(
    text: string,
    languageId: string = "mon",
    callbacks?: {
        onPlay?: () => void;
        onEnd?: () => void;
        onError?: (err: Error) => void;
    }
) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/tts/stream`;

    let abortController = new AbortController();
    let audio: HTMLAudioElement | null = null;
    let objectUrl: string | null = null;

    const cleanup = () => {
        if (audio) {
            audio.onplay = null;
            audio.onended = null;
            audio.onerror = null;
            audio.pause();
            // Don't set audio.src = "" — it fires a spurious MediaError
            audio = null;
        }
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrl = null;
        }
    };

    const play = async () => {
        abortController = new AbortController();

        console.log("[TTS] Fetching stream from:", url);

        let response: Response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim(), language_id: languageId }),
                signal: abortController.signal,
            });
        } catch (err) {
            console.error("[TTS] Fetch threw:", err);
            throw err;
        }

        console.log("[TTS] Response status:", response.status, response.statusText);

        if (!response.ok) {
            let body = "";
            try {
                body = await response.text();
            } catch (_) {
                /* ignore */
            }
            console.error("[TTS] Response not OK. Body:", body);
            throw new Error(`TTS failed: ${response.status} ${response.statusText} — ${body}`);
        }

        const blob = await response.blob();
        console.log("[TTS] Received blob:", blob.type, blob.size, "bytes");

        objectUrl = URL.createObjectURL(blob);
        audio = new Audio(objectUrl);

        audio.onplay = () => {
            console.log("[TTS] Audio play event fired");
            callbacks?.onPlay?.();
        };
        audio.onended = () => {
            console.log("[TTS] Audio ended");
            cleanup();
            callbacks?.onEnd?.();
        };
        audio.onerror = () => {
            console.error("[TTS] Audio error event:", audio?.error);
            cleanup();
            callbacks?.onError?.(new Error("Audio playback failed"));
        };

        try {
            await audio.play();
        } catch (err) {
            console.error("[TTS] audio.play() threw:", err);
            cleanup();
            throw err;
        }
    };

    const stop = () => {
        abortController.abort();
        cleanup();
        callbacks?.onEnd?.();
    };

    return { play, stop };
}
