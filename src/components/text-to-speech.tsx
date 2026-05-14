import { streamTextToSpeech } from "@/services/tts";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, Volume2, Square } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGUAGES = [
    { id: "mon", name: "Mongolian" },
    { id: "eng", name: "English" },
    { id: "tha", name: "Thai" },
    { id: "ben", name: "Bengali" },
    { id: "hin", name: "Hindi" },
];

export default function TextToSpeech() {
    const [inputText, setInputText] = useState("");
    const [ttsState, setTtsState] = useState<'idle' | 'buffering' | 'playing'>('idle');
    const [selectedLang, setSelectedLang] = useState("mon");
    const ttsSessionRef = useRef<{ stop: () => void } | null>(null);

    const handleTTS = () => {
        // Stop if already playing or buffering
        if (ttsState !== 'idle') {
            ttsSessionRef.current?.stop();
            ttsSessionRef.current = null;
            setTtsState('idle');
            return;
        }

        if (!inputText.trim()) return;

        setTtsState('buffering');

        const session = streamTextToSpeech(inputText, selectedLang, {
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

    return (
        <div className="flex gap-2 flex-col">
            <div className="w-[200px]">
                <Select value={selectedLang} onValueChange={setSelectedLang}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Textarea
                placeholder="Enter text to convert to speech..."
                className="min-h-[120px] resize-none text-lg"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex gap-4 items-center">
                <Button onClick={handleTTS}>
                    {ttsState === 'buffering' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : ttsState === 'playing' ? (
                        <Square className="h-5 w-5 fill-current" />
                    ) : (
                        <Volume2 className="h-5 w-5" />
                    )}
                    {ttsState === 'buffering' ? "Loading..." : ttsState === 'playing' ? "Stop" : "Play"}
                </Button>
            </div>
        </div>
    );
}