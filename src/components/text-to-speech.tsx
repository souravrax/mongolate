import { streamTextToSpeech } from "@/services/tts";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, Volume2, Square } from "lucide-react";
import { AudioWave } from "./audio-wave";
import { LanguageDrawer } from "./language-drawer";
import { useVoiceStore } from "@/store/voice-store";

export default function TextToSpeech() {
    const [inputText, setInputText] = useState("");
    const [ttsState, setTtsState] = useState<'idle' | 'buffering' | 'playing' | 'paused'>('idle');
    const [selectedLang, setSelectedLang] = useState("en");
    const ttsSessionRef = useRef<{ pause: () => void; resume: () => void; stop: () => void } | null>(null);

    const { getVoiceForLanguage } = useVoiceStore();

    const startTTS = () => {
        if (!inputText.trim()) return;

        const voice = getVoiceForLanguage(selectedLang);

        setTtsState('buffering');

        const session = streamTextToSpeech(inputText, selectedLang, voice, {
            onPlay: () => setTtsState('playing'),
            onEnd: () => {
                ttsSessionRef.current = null;
                setTtsState('idle');
            },
            onError: (err) => {
                console.error("[TTS Component] onError:", err);
                toast.error("Failed to play speech.");
                ttsSessionRef.current = null;
                setTtsState('idle');
            },
        });

        ttsSessionRef.current = session;

        session.play().catch((err) => {
            console.error("[TTS Component] session.play() error:", err);
            ttsSessionRef.current = null;
            setTtsState('idle');
        });
    };

    const handleTTS = () => {
        if (ttsState === 'idle') {
            startTTS();
        } else if (ttsState === 'playing') {
            ttsSessionRef.current?.pause();
            setTtsState('paused');
        } else if (ttsState === 'paused') {
            ttsSessionRef.current?.resume();
            setTtsState('playing');
        }
    };

    const handleStopTTS = () => {
        ttsSessionRef.current?.stop();
        ttsSessionRef.current = null;
        setTtsState('idle');
    };

    return (
        <div className="flex gap-2 flex-col">
            <div className="w-[200px]">
                <LanguageDrawer
                    selectedLang={selectedLang}
                    onSelect={setSelectedLang}
                    label="Language"
                />
            </div>
            <Textarea
                placeholder="Enter text to convert to speech..."
                className="min-h-[120px] resize-none text-lg"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex gap-2 items-center">
                <Button onClick={handleTTS}>
                    {ttsState === 'buffering' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : ttsState === 'playing' ? (
                        <AudioWave className="h-5 w-5" />
                    ) : ttsState === 'paused' ? (
                        <Volume2 className="h-5 w-5" />
                    ) : (
                        <Volume2 className="h-5 w-5" />
                    )}
                    {ttsState === 'buffering' ? "Loading..." : ttsState === 'playing' ? "Pause" : ttsState === 'paused' ? "Resume" : "Play"}
                </Button>
                {(ttsState === 'buffering' || ttsState === 'playing' || ttsState === 'paused') && (
                    <Button variant="neutral" onClick={handleStopTTS}>
                        <Square className="h-4 w-4 fill-current" />
                        Stop
                    </Button>
                )}
            </div>
        </div>
    );
}