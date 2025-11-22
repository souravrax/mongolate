import { useState } from "react";
import { translateText } from "@/services/translate";
import { textToSpeech } from "@/services/tts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, Languages, Volume2 } from "lucide-react";

function App() {
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

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-primary tracking-tight">Mongolate</h1>
            <p className="text-xs text-muted-foreground">For Pineapple</p>
          </div>
        </header>

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
          className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-[0.98]"
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
            </CardHeader>
            <CardContent>
              {translatedText}
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
