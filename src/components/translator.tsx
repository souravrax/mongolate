import { useState, useEffect, useRef } from "react";
import { translateText } from "@/services/translate";
import { textToSpeech } from "@/services/tts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Volume2, CopyIcon, ArrowRightLeft, X } from "lucide-react";
import { useHistoryStore } from "@/store/history-store";

const LANGUAGES = [
    { id: "en", name: "English" },
    { id: "mn", name: "Mongolian" },
    { id: "th", name: "Thai" },
    { id: "bn", name: "Bengali" },
    { id: "hi", name: "Hindi" },
];

function Translator() {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("mn");
    const outputRef = useRef<HTMLDivElement>(null);

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
            toast.success("Translation complete!");

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

    const handleTTS = async () => {
        if (!translatedText) return;

        setIsPlaying(true);
        try {
            const langMap: Record<string, string> = {
                'en': 'eng',
                'mn': 'mon',
                'th': 'tha',
                'bn': 'ben',
                'hi': 'hin'
            };
            const mappedLang = langMap[targetLang] || targetLang;
            const audioUrl = await textToSpeech(translatedText, mappedLang);
            const audio = new Audio(audioUrl);

            audio.onended = () => {
                setIsPlaying(false);
            };

            await audio.play();
        } catch (error) {
            toast.error("Failed to generate speech. Check your token or try again.");
            console.error(error);
            setIsPlaying(false);
        }
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
                    flex flex-col border-2 border-border bg-background rounded-base overflow-hidden
                    transition-[flex] duration-500 ease-out
                    ${hasResult ? "flex-[0_0_45%] min-h-0" : "flex-1 min-h-0"}
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
                <div className="shrink-0 flex flex-col gap-0 border-t-2 border-border bg-secondary-background/30">
                    {/* Language bar */}
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border/50">
                        <div className="flex-1">
                            <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger className="border-0 bg-transparent shadow-none font-semibold text-foreground focus:ring-0 px-0 h-8">
                                    <SelectValue placeholder="Detect language" />
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

                        <Button variant="neutral" size="icon" onClick={handleSwapLanguages} className="shrink-0 h-8 w-8">
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                        </Button>

                        <div className="flex-1">
                            <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger className="border-0 bg-transparent shadow-none font-semibold text-foreground focus:ring-0 px-0 h-8 justify-end">
                                    <SelectValue placeholder="Select language" />
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
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            {inputText && (
                                <Button variant="neutral" size="icon" onClick={handleClear} className="h-8 w-8">
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
                    flex flex-col border-2 border-border bg-main/5 rounded-base overflow-hidden mt-2
                    transition-all duration-500 ease-out
                    ${hasResult ? "flex-[0_0_45%] min-h-0 opacity-100" : "flex-[0_0_0%] min-h-0 opacity-0 pointer-events-none"}
                `}
            >
                {/* Output text — scrolls internally */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4">
                    <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">
                        {translatedText}
                    </p>
                </div>

                {/* Output toolbar */}
                <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t-2 border-border bg-secondary-background/30">
                    <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider">
                        {targetLang}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="neutral"
                            size="icon"
                            onClick={handleCopy}
                            className="h-8 w-8"
                        >
                            <CopyIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="neutral"
                            size="icon"
                            onClick={handleTTS}
                            disabled={isPlaying}
                            className="h-8 w-8"
                        >
                            {isPlaying ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Volume2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Translator;
