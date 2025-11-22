import { useState } from "react";
import { translateText } from "@/services/translate";
import { textToSpeech } from "@/services/tts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Volume2, CopyIcon } from "lucide-react";

function Translator() {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast.error("Please enter some text to translate.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await translateText(inputText);
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
            // We re-use hfToken state for Narakeet API key
            const audioUrl = await textToSpeech(translatedText);
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

    return (
        <div className="w-full flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>English</CardTitle>
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
                        <CardTitle>Mongolian</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                onClick={handleCopy}
                            >
                                <CopyIcon size={20} />
                            </Button>
                            <Button
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
                        {translatedText}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


export default Translator;
