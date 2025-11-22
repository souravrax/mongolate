import { textToSpeech } from "@/services/tts";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, Volume2 } from "lucide-react";
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedLang, setSelectedLang] = useState("mon");

    const handleTTS = async () => {
        if (!inputText) return;

        setIsPlaying(true);
        try {
            const audioUrl = await textToSpeech(inputText, selectedLang);
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
                <Button
                    onClick={handleTTS}
                    disabled={isPlaying}
                >
                    {isPlaying ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Volume2 className="h-5 w-5" />
                    )}
                    {
                        isPlaying ? "Stop" : "Play"
                    }
                </Button>
            </div>
        </div>
    );
}