import { Toaster } from "@/components/ui/sonner";
import { Languages } from "lucide-react";
import Translator from "./components/translator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import TextToSpeech from "./components/text-to-speech";

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-md mx-auto space-y-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg">
              <Languages className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-2xl font-instrument-serif font-semibold text-primary tracking-tight">Mongolate</h1>
            <p className="text-xs text-foreground/50">for Pineapple</p>
          </div>
        </header>
        <Tabs defaultValue="translator" className="w-full">
          <TabsList>
            <TabsTrigger value="translator">Translator</TabsTrigger>
            <TabsTrigger value="tts">Text to Speech</TabsTrigger>
          </TabsList>
          <TabsContent value="translator">
            <Translator />
          </TabsContent>
          <TabsContent value="tts">
            <TextToSpeech />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}


export default App;
