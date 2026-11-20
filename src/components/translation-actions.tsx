import { Languages, Loader2, Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SpeechState = "idle" | "buffering" | "playing" | "paused";

interface TranslationActionsProps {
  translating: boolean;
  canTranslate: boolean;
  canSpeak: boolean;
  speechState: SpeechState;
  onTranslate: () => void;
  onSpeak: () => void;
  onStop: () => void;
}

export function TranslationActions({ translating, canTranslate, canSpeak, speechState, onTranslate, onSpeak, onStop }: TranslationActionsProps) {
  const speechLabels = { idle: "Speak", buffering: "Loading…", playing: "Pause", paused: "Resume" };
  const SpeechIcon = { idle: Volume2, buffering: Loader2, playing: Pause, paused: Play }[speechState];

  return (
    <div className="translation-actions" role="group" aria-label="Translation and speech">
      <Button size="action" onClick={onTranslate} disabled={translating || !canTranslate} aria-busy={translating} className="translate-action">
        {translating ? <Loader2 className="size-6 animate-spin" aria-hidden="true" /> : <Languages className="size-6" aria-hidden="true" />}
        {translating ? "Translating…" : "Translate"}
      </Button>
      <Button variant="secondary" size="action" onClick={onSpeak} disabled={!canSpeak || speechState === "buffering"} aria-busy={speechState === "buffering"} className="speak-action">
        <SpeechIcon className={`size-6 ${speechState === "buffering" ? "animate-spin" : ""}`} aria-hidden="true" />
        {speechLabels[speechState]}
      </Button>
      {speechState !== "idle" && (
        <Button variant="secondary" size="icon" className="stop-action" onClick={onStop} aria-label="Stop speech">
          <Square className="size-4 fill-current" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
