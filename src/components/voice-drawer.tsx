import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import { X, Check } from "lucide-react";
import { useVoiceStore } from "@/store/voice-store";
import { getVoiceLabel, getDefaultVoice } from "@/lib/languages";
import { VoiceUserIcon } from "@/components/icons/voice-user-icon";

interface VoiceDrawerProps {
    lang: string;
    align?: "left" | "right";
}

export function VoiceDrawer({
    lang,
    align = "right",
}: VoiceDrawerProps) {
    const [open, setOpen] = useState(false);
    const voiceMap = useVoiceStore((state) => state.voiceMap);
    const voices = useVoiceStore((state) => state.voices);
    const setVoiceForLanguage = useVoiceStore((state) => state.setVoiceForLanguage);

    const currentVoice = voiceMap[lang] || voices[lang]?.default || getDefaultVoice(lang);
    const langVoices = voices[lang]?.voices ?? [];

    const selectedVoiceLabel = useMemo(() => getVoiceLabel(currentVoice), [currentVoice]);

    const handleVoiceSelect = (voiceName: string) => {
        setVoiceForLanguage(lang, voiceName);
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    className={`h-8 px-0 font-semibold text-foreground hover:bg-transparent hover:translate-x-0 hover:translate-y-0 ${
                        align === "right" ? "justify-end" : "justify-start"
                    }`}
                >
                    <VoiceUserIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span className="truncate text-sm">{selectedVoiceLabel}</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[70vh]">
                <DrawerHeader className="flex items-center justify-between pb-2">
                    <DrawerTitle className="flex items-center gap-2">
                        <VoiceUserIcon className="h-5 w-5" />
                        Select Voice
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="outline" size="icon">
                            <X className="h-4 w-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                {/* Voice list */}
                <div className="px-4 pb-4 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-2">
                        <div className="space-y-2">
                            {langVoices.length > 0 ? (
                                langVoices.map((voice) => {
                                    const isVoiceSelected = voice.name === currentVoice;
                                    return (
                                        <div
                                            key={voice.name}
                                            onClick={() => handleVoiceSelect(voice.name)}
                                            className={`cursor-pointer border rounded-xl p-3 transition-colors ${
                                                isVoiceSelected
                                                    ? "border-primary bg-accent"
                                                    : "hover:bg-accent"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <VoiceUserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{voice.label}</span>
                                                    <span className="text-[10px] text-muted-foreground capitalize">
                                                        {voice.gender}
                                                    </span>
                                                </div>
                                                {isVoiceSelected && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No voices available for this language
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
