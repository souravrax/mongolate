export const textToSpeech = async (text: string, languageId: string = "mon"): Promise<string> => {
    if (!text.trim()) {
        throw new Error("Text is empty");
    }

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

        const blob = await response.blob();
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
    const params = new URLSearchParams({
        text: text.trim(),
        language_id: languageId,
    });
    const url = `${baseUrl}/tts/stream?${params.toString()}`;

    let audio: HTMLAudioElement | null = null;

    const cleanup = () => {
        if (audio) {
            // Remove handlers BEFORE mutating src so spurious errors are ignored
            audio.onplay = null;
            audio.onended = null;
            audio.onerror = null;
            audio.pause();
            audio.src = "";
            audio.removeAttribute("src");
            audio = null;
        }
    };

    const play = async () => {
        console.log("[TTS] Streaming via GET:", url);

        audio = new Audio(url);

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
            // Ignore errors caused by our own cleanup
            if (!audio) return;
            console.error("[TTS] Audio error event:", audio.error);
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

    const pause = () => {
        audio?.pause();
    };

    const resume = async () => {
        if (audio) {
            await audio.play();
        }
    };

    const stop = () => {
        cleanup();
        callbacks?.onEnd?.();
    };

    return { play, pause, resume, stop };
}
