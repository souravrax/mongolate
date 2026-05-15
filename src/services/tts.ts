export const textToSpeech = async (
    text: string,
    languageId: string = "mon",
    voiceName?: string
): Promise<string> => {
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
                language_id: languageId,
                voice: voiceName,
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
    voiceName?: string,
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
    if (voiceName) {
        params.set("voice", voiceName);
    }
    const url = `${baseUrl}/tts/stream?${params.toString()}`;

    let audio: HTMLAudioElement | null = null;

    const cleanup = () => {
        if (audio) {
            audio.onplay = null;
            audio.onended = null;
            audio.onerror = null;
            audio.pause();
            audio = null;
        }
    };

    const play = async () => {
        audio = new Audio(url);

        audio.onplay = () => {
            callbacks?.onPlay?.();
        };
        audio.onended = () => {
            cleanup();
            callbacks?.onEnd?.();
        };
        audio.onerror = () => {
            if (!audio) return;
            cleanup();
            callbacks?.onError?.(new Error("Audio playback failed"));
        };

        await audio.play();
    };

    const pause = () => audio?.pause();
    const resume = () => audio?.play();

    const stop = () => {
        cleanup();
        callbacks?.onEnd?.();
    };

    return { play, pause, resume, stop };
}
