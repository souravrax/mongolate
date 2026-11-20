import * as m from "motion/react-m";
import { Languages, Loader2, Pause, Play, Square, Volume2 } from "lucide-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { AnimatedControlContent } from "@/components/ui/animated-control-content";
import { Button } from "@/components/ui/button";

export type SpeechState = "idle" | "buffering" | "playing" | "paused";

interface TranslationActionsProps {
  translating: boolean;
  instant?: boolean;
  canTranslate: boolean;
  canSpeak: boolean;
  hasTranslation: boolean;
  speechState: SpeechState;
  onTranslate: () => void;
  onSpeak: () => void;
  onStop: () => void;
}

export function TranslationActions({ translating, instant = false, canTranslate, canSpeak, hasTranslation, speechState, onTranslate, onSpeak, onStop }: TranslationActionsProps) {
  const reducedMotion = useReducedMotion();
  const speechWidth = speechState === "idle" ? "40%" : "56%";
  const easeOut = [0.23, 1, 0.32, 1] as const;
  const speechLabels = { idle: "Speak", buffering: "Loading…", playing: "Pause", paused: "Resume" };
  const SpeechIcon = { idle: Volume2, buffering: Loader2, playing: Pause, paused: Play }[speechState];

  const stopButton = (
    <Button variant="secondary" size="icon" className="stop-action" onClick={onStop} aria-label="Stop speech">
      <Square className="size-4 fill-current" aria-hidden="true" />
    </Button>
  );

  return (
    <div className="translation-actions" role="group" aria-label="Translation and speech">
      <Button size="action" onClick={onTranslate} disabled={translating || !canTranslate} aria-busy={translating} aria-label={translating ? "Translating…" : "Translate"} className="translate-action">
        <AnimatedControlContent stateKey={translating ? "loading" : "ready"} instant={instant}>
          {translating ? <Loader2 className="size-6 animate-spin" /> : <Languages className="size-6" />}
          {translating ? "Translating…" : "Translate"}
        </AnimatedControlContent>
      </Button>
      <m.div
        className="speech-action-slot"
        initial={false}
        animate={{ flexBasis: hasTranslation ? speechWidth : "0%", opacity: hasTranslation ? 1 : 0 }}
        transition={{
          flexBasis: { duration: instant || reducedMotion ? 0 : 0.26, ease: easeOut },
          opacity: { duration: instant ? 0 : reducedMotion ? 0.1 : 0.16, ease: easeOut },
        }}
        inert={!hasTranslation}
        aria-hidden={!hasTranslation}
      >
        <Button variant="secondary" size="action" onClick={onSpeak} disabled={!canSpeak || speechState === "buffering"} aria-busy={speechState === "buffering"} aria-label={speechLabels[speechState]} className="speak-action">
          <AnimatedControlContent stateKey={speechState} instant={instant}>
            <SpeechIcon className={`size-6 ${speechState === "buffering" ? "animate-spin" : ""}`} />
            {speechLabels[speechState]}
          </AnimatedControlContent>
        </Button>
        {instant ? (speechState !== "idle" && stopButton) : (
          <AnimatePresence initial={false}>
            {speechState !== "idle" && (
              <m.div
                key="stop"
                className="stop-action-slot"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
                transition={{ duration: reducedMotion ? 0.1 : 0.16, ease: [0.23, 1, 0.32, 1] }}
              >
                {stopButton}
              </m.div>
            )}
          </AnimatePresence>
        )}
      </m.div>
    </div>
  );
}
