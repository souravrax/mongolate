import { useState, useEffect, useRef } from "react";
import { translateText } from "@/services/translate";
import { streamTextToSpeech } from "@/services/tts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Volume2, CopyIcon, ArrowRightLeft, X, Square } from "lucide-react";
import { AudioWave } from "./audio-wave";
import { LanguageDrawer } from "./language-drawer";
import { VoiceDrawer } from "./voice-drawer";
import { useHistoryStore } from "@/store/history-store";
import { useVoiceStore } from "@/store/voice-store";
import { getLanguageName } from "@/lib/languages";

function Translator() {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ttsState, setTtsState] = useState<'idle' | 'buffering' | 'playing' | 'paused'>('idle');
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("mn");
    const outputRef = useRef<HTMLDivElement>(null);
    const ttsSessionRef = useRef<{ pause: () => void; resume: () => void; stop: () => void } | null>(null);

    const { saveTranslation } = useHistoryStore();
    const hasResult = !!translatedText;

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast.error("Please enter some text to translate.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await translateText(inputText, sourceLang, targetLang);
            setTranslatedText(result);

            saveTranslation({
                sourceText: inputText.trim(),
                translatedText: result,
                sourceLang,
                targetLang,
            });
        } catch (error) {
            toast.error("Translation failed. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const voiceMap = useVoiceStore((state) => state.voiceMap);
    const voices = useVoiceStore((state) => state.voices);

    const startTTS = () => {
        if (!translatedText) return;

        const voice = voiceMap[targetLang] || voices[targetLang]?.default || "";

        setTtsState('buffering');

        const session = streamTextToSpeech(translatedText, targetLang, voice, {
            onPlay: () => setTtsState('playing'),
            onEnd: () => {
                ttsSessionRef.current = null;
                setTtsState('idle');
            },
            onError: (err) => {
                console.error("[Translator] onError:", err);
                toast.error("Failed to play speech.");
                ttsSessionRef.current = null;
                setTtsState('idle');
            },
        });

        ttsSessionRef.current = session;

        session.play().catch((err) => {
            console.error("[Translator] session.play() error:", err);
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
        // buffering: handled by stop button
    };

    const handleStopTTS = () => {
        ttsSessionRef.current?.stop();
        ttsSessionRef.current = null;
        setTtsState('idle');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText);
        toast.success("Text copied to clipboard!");
    };

    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    const handleClear = () => {
        setInputText("");
        setTranslatedText("");
    };

    useEffect(() => {
        const handler = (e: Event) => {
            const custom = e as CustomEvent<{ sourceText: string; sourceLang: string; targetLang: string }>;
            setInputText(custom.detail.sourceText);
            setSourceLang(custom.detail.sourceLang);
            setTargetLang(custom.detail.targetLang);
            setTranslatedText("");
        };
        window.addEventListener("load-translation", handler);
        return () => window.removeEventListener("load-translation", handler);
    }, []);

    return (
        <div className="h-[calc(100dvh-3.5rem)] flex flex-col">
            {/* Input section — shrinks when result appears */}
            <div
                className={`
                    flex flex-col overflow-hidden
                    transition-[flex] duration-500 ease-out
                    ${hasResult ? "flex-[0_0_48%] min-h-0" : "flex-1 min-h-0"}
                `}
            >
                {/* Textarea — fills the section and scrolls internally */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <Textarea
                        placeholder="Enter text..."
                        className="w-full h-full min-h-0 resize-none text-xl bg-transparent border-0 p-4 shadow-none focus-visible:ring-0 rounded-none placeholder:text-foreground/30"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                {/* Bottom toolbar */}
                <div className="shrink-0 flex flex-col gap-0 bg-accent text-accent-foreground rounded-2xl">
                    {/* Language bar */}
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border/50">
                        <div className="flex-1">
                            <LanguageDrawer
                                selectedLang={sourceLang}
                                onSelect={setSourceLang}
                                label="Source Language"
                                align="left"
                            />
                        </div>

                        <Button variant="outline" size="icon" onClick={handleSwapLanguages} className="shrink-0 h-8 w-8">
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                        </Button>

                        <div className="flex-1">
                            <LanguageDrawer
                                selectedLang={targetLang}
                                onSelect={setTargetLang}
                                label="Target Language"
                                align="right"
                            />
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            {inputText && (
                                <Button variant="outline" size="icon" onClick={handleClear} className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                            <span className="text-xs text-foreground/40 font-medium tabular-nums">
                                {inputText.length}
                            </span>
                        </div>
                        <Button
                            onClick={handleTranslate}
                            disabled={isLoading || !inputText.trim()}
                            size="sm"
                            className="font-semibold px-5"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : null}
                            Translate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Output section — slides up when ready */}
            <div
                ref={outputRef}
                className={`
                    flex flex-col overflow-hidden mt-2
                    transition-all duration-500 ease-out
                    ${hasResult ? "flex-[0_0_50%] min-h-0 opacity-100" : "flex-[0_0_0%] min-h-0 opacity-0 pointer-events-none"}
                `}
            >
                {/* Output text — scrolls internally */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4">
                    <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">
                        {translatedText}
                    </p>
                </div>

                {/* Output toolbar */}
                <div className="shrink-0 flex flex-col gap-0 bg-accent text-accent-foreground rounded-2xl">
                    {/* Voice bar */}
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border/50">
                        <span className="text-xs font-semibold text-foreground/40 tracking-wider">
                            {getLanguageName(targetLang)}
                        </span>
                        <VoiceDrawer
                            lang={targetLang}
                            align="right"
                        />
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="h-8 w-8"
                            >
                                <CopyIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTTS}
                                className="h-8 gap-1.5"
                            >
                                {ttsState === 'buffering' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : ttsState === 'playing' ? (
                                    <AudioWave className="h-4 w-4" />
                                ) : (
                                    <Volume2 className="h-4 w-4" />
                                )}
                                {ttsState === 'buffering'
                                    ? "Loading..."
                                    : ttsState === 'playing'
                                    ? "Pause"
                                    : ttsState === 'paused'
                                    ? "Resume"
                                    : "Listen"}
                            </Button>
                            {(ttsState === 'buffering' || ttsState === 'playing' || ttsState === 'paused') && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleStopTTS}
                                    className="h-8 w-8"
                                >
                                    <Square className="h-3 w-3 fill-current" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Translator;
