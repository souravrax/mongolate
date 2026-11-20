import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { translateText } from "@/services/translate";
import { streamTextToSpeech } from "@/services/tts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, ArrowRightLeft, X } from "lucide-react";
import { LanguageDrawer } from "./language-drawer";
import { VoiceDrawer } from "./voice-drawer";
import { TranslationPanel } from "./translation-panel";
import { TranslationActions, type SpeechState } from "./translation-actions";
import { useHistoryStore } from "@/store/history-store";
import { useVoiceStore } from "@/store/voice-store";
import { useSwapAnimation } from "@/hooks/use-swap-animation";
import { getLanguageName } from "@/lib/languages";

function Translator() {
  const [swapCount, setSwapCount] = useState(0);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [interactionMode, setInteractionMode] = useState<"pointer" | "keyboard">("pointer");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("mn");
  const speechRef = useRef<ReturnType<typeof streamTextToSpeech> | null>(null);
  const requestRef = useRef(0);
  const saveTranslation = useHistoryStore((state) => state.saveTranslation);
  const voiceMap = useVoiceStore((state) => state.voiceMap);
  const voices = useVoiceStore((state) => state.voices);

  useSwapAnimation(workspaceRef, swapCount, interactionMode === "pointer");

  const stopSpeech = () => {
    speechRef.current?.stop();
    speechRef.current = null;
    setSpeechState("idle");
  };

  const invalidateResult = () => {
    requestRef.current += 1;
    setIsLoading(false);
    stopSpeech();
    setTranslatedText("");
  };

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;
    stopSpeech();
    const request = ++requestRef.current;
    setIsLoading(true);
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      if (request !== requestRef.current) return;
      setTranslatedText(result);
      saveTranslation({ sourceText: inputText.trim(), translatedText: result, sourceLang, targetLang });
    } catch (error) {
      if (request === requestRef.current) {
        toast.error(error instanceof Error ? error.message : "Translation failed. Please try again.");
      }
    } finally {
      if (request === requestRef.current) setIsLoading(false);
    }
  };

  const handleSpeech = async () => {
    if (speechState === "playing") {
      speechRef.current?.pause();
      setSpeechState("paused");
      return;
    }
    if (speechState === "paused") {
      const session = speechRef.current;
      try {
        await session?.resume();
        if (session && speechRef.current === session) setSpeechState("playing");
      } catch {
        if (speechRef.current === session) {
          stopSpeech();
          toast.error("Could not resume speech. Please try again.");
        }
      }
      return;
    }
    if (!translatedText || speechState === "buffering") return;
    const voice = voiceMap[targetLang] || voices[targetLang]?.default;
    setSpeechState("buffering");
    const session = streamTextToSpeech(translatedText, targetLang, voice, {
      onPlay: () => {
        if (speechRef.current === session) setSpeechState("playing");
      },
      onEnd: () => {
        if (speechRef.current === session) {
          speechRef.current = null;
          setSpeechState("idle");
        }
      },
      onError: () => {
        if (speechRef.current === session) {
          speechRef.current = null;
          setSpeechState("idle");
          toast.error("Failed to play speech. Please try again.");
        }
      },
    });
    speechRef.current = session;
    try {
      await session.play();
    } catch {
      if (speechRef.current === session) {
        stopSpeech();
        toast.error("Failed to play speech. Please try again.");
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      toast.success("Translation copied");
    } catch {
      toast.error("Could not copy. Please select the text to copy it.");
    }
  };

  const handleSwap = () => {
    setSwapCount((count) => count + 1);
    requestRef.current += 1;
    setIsLoading(false);
    stopSpeech();
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText || inputText);
    setTranslatedText(translatedText ? inputText : "");
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<{ sourceText: string; sourceLang: string; targetLang: string }>;
      requestRef.current += 1;
      speechRef.current?.stop();
      speechRef.current = null;
      setSpeechState("idle");
      setIsLoading(false);
      setInputText(detail.sourceText);
      setSourceLang(detail.sourceLang);
      setTargetLang(detail.targetLang);
      setTranslatedText("");
    };
    window.addEventListener("load-translation", handler);
    return () => {
      window.removeEventListener("load-translation", handler);
      requestRef.current += 1;
      speechRef.current?.stop();
    };
  }, []);

  return (
    <div
      className="translator"
      onPointerDownCapture={() => setInteractionMode("pointer")}
      onKeyDownCapture={() => setInteractionMode("keyboard")}
    >
      <div className="translation-workspace" ref={workspaceRef}>
        <TranslationPanel className="source-panel" aria-label="Source text">
          <div className="source-language">
            <LanguageDrawer selectedLang={sourceLang} onSelect={(lang) => { invalidateResult(); setSourceLang(lang); }} label="Source language" className="w-full" />
          </div>
          <Textarea
            aria-label="Text to translate"
            lang={sourceLang}
            dir="auto"
            placeholder="Enter text…"
            value={inputText}
            onChange={(event) => { invalidateResult(); setInputText(event.target.value); }}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                void handleTranslate();
              }
            }}
            className="translation-text translation-input"
          />
          <div className="source-footer">
            <span className="character-count">{inputText.length > 0 && `${inputText.length.toLocaleString()} characters`}</span>
            <Button variant="ghost" size="icon" onClick={() => { invalidateResult(); setInputText(""); }} disabled={!inputText} aria-label="Clear text">
              <X className="size-6" aria-hidden="true" />
            </Button>
          </div>
        </TranslationPanel>
        <Button variant="swap" size="icon-lg" className="language-swap" onClick={handleSwap} aria-label="Swap languages">
          <m.span
            className="inline-flex"
            animate={{ rotate: reducedMotion ? 0 : swapCount * 180 }}
            transition={{ duration: interactionMode === "keyboard" || reducedMotion ? 0 : 0.48, ease: [0.23, 1, 0.32, 1] }}
          >
            <ArrowRightLeft className="size-5" aria-hidden="true" />
          </m.span>
        </Button>
        <TranslationPanel tone="result" className="result-panel" aria-label="Translation">
          <div className="target-language">
            <LanguageDrawer selectedLang={targetLang} onSelect={(lang) => { invalidateResult(); setTargetLang(lang); }} label="Target language" className="w-full" />
          </div>
          <div className="translation-output" aria-busy={isLoading}>
            <p className={`translation-text ${translatedText ? "" : "translation-placeholder"}`} lang={targetLang} dir="auto" aria-live="polite" aria-atomic="true">
              {translatedText || (isLoading ? "Translating…" : "Your translation")}
            </p>
          </div>
          <div className="result-footer">
            <VoiceDrawer lang={targetLang} className="voice-selector" />
            <Button variant="surface" size="lg" onClick={handleCopy} disabled={!translatedText} aria-label="Copy translation">
              <Copy className="size-5" aria-hidden="true" />
              Copy
            </Button>
          </div>
        </TranslationPanel>
      </div>
      <TranslationActions hasTranslation={!!translatedText} instant={interactionMode === "keyboard"} translating={isLoading} canTranslate={!!inputText.trim()} canSpeak={!!translatedText && !isLoading} speechState={speechState} onTranslate={handleTranslate} onSpeak={handleSpeech} onStop={stopSpeech} />
      <span className="sr-only" role="status">{translatedText ? `Translated to ${getLanguageName(targetLang)}` : ""}</span>
    </div>
  );
}

export default Translator;
