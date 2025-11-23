import { useState } from "react";
import { translateText } from "@/services/translate";
import { textToSpeech } from "@/services/tts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Volume2, CopyIcon, ArrowRightLeft } from "lucide-react";

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
            // Pass the target language to the TTS service
            // Note: TTS service expects 'mon' for Mongolian, but translation service uses 'mn'.
            // We need to map 'mn' to 'mon' if necessary, or ensure consistency.
            // The TTS service supports: mon, eng, tha, ben, hin.
            // The translation service uses ISO codes which might differ slightly (e.g. mn vs mon).
            // For now, let's map 'mn' to 'mon' manually if needed, or assume they align enough or handle it.
            // Actually, TTS uses 3-letter codes. Translation often uses 2-letter.
            // Let's create a simple mapping or just use the 3-letter codes if possible for translation too?
            // MyMemory API usually accepts 2-letter codes.
            // Let's map for TTS.

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

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 items-center place-content-center">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger>
                        <SelectValue placeholder="Source Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button variant="neutral" onClick={handleSwapLanguages}>
                    <ArrowRightLeft />
                </Button>

                <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger>
                        <SelectValue placeholder="Target Language" />
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

            <Card>
                <CardHeader>
                    <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Enter text to translate..."
                        className="min-h-[120px] resize-none text-lg"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Button
                onClick={handleTranslate}
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Translating...
                    </>
                ) : (
                    "Translate"
                )}
            </Button>

            {translatedText && (
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Output</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="neutral"
                                size="icon"
                                onClick={handleCopy}
                            >
                                <CopyIcon size={20} />
                            </Button>
                            <Button
                                variant="neutral"
                                size="icon"
                                onClick={handleTTS}
                                disabled={isPlaying}
                            >
                                {isPlaying ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Volume2 className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">{translatedText}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


export default Translator;
