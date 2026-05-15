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
import { Globe, Search, X, Check, ChevronRight, Volume2 } from "lucide-react";
import { LANGUAGE_META, getLanguageName, getVoiceLabel } from "@/lib/languages";
import { useVoiceStore } from "@/store/voice-store";

interface LanguageDrawerProps {
    selectedLang: string;
    onSelect: (langId: string) => void;
    label?: string;
    align?: "left" | "right";
    excludeLangs?: string[];
}

export function LanguageDrawer({
    selectedLang,
    onSelect,
    label = "Language",
    align = "left",
    excludeLangs = [],
}: LanguageDrawerProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [expandedLang, setExpandedLang] = useState<string | null>(null);

    const { voices, getVoiceForLanguage, setVoiceForLanguage } = useVoiceStore();

    const languages = useMemo(() => {
        const all = Object.keys(LANGUAGE_META).map((id) => ({
            id,
            ...LANGUAGE_META[id],
        }));
        const filtered = all.filter((l) => !excludeLangs.includes(l.id));
        if (!query.trim()) return filtered;
        const q = query.toLowerCase();
        return filtered.filter(
            (l) =>
                l.name.toLowerCase().includes(q) ||
                l.id.toLowerCase().includes(q)
        );
    }, [query, excludeLangs]);

    const handleSelectLanguage = (id: string) => {
        onSelect(id);
        setExpandedLang(id);
    };

    const handleVoiceSelect = (langId: string, voiceName: string) => {
        setVoiceForLanguage(langId, voiceName);
        setOpen(false);
        setExpandedLang(null);
        setQuery("");
    };

    const selectedName = getLanguageName(selectedLang);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="neutral"
                    className={`h-8 px-0 font-semibold text-foreground bg-transparent border-transparent shadow-none hover:bg-transparent hover:shadow-none hover:translate-x-0 hover:translate-y-0 ${
                        align === "right" ? "justify-end" : "justify-start"
                    }`}
                >
                    <span className="truncate">{selectedName}</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
                <DrawerHeader className="flex items-center justify-between pb-2">
                    <DrawerTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {label}
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="neutral" size="icon">
                            <X className="h-4 w-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                {/* Search */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search language..."
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-3 rounded-base border-2 border-border bg-background text-sm font-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Language list */}
                <div className="px-4 pb-4 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-2">
                        <div className="space-y-1">
                            {languages.map((lang) => {
                                const isSelected = lang.id === selectedLang;
                                const isExpanded = expandedLang === lang.id;
                                const currentVoice = getVoiceForLanguage(lang.id);
                                const langVoices = voices[lang.id]?.voices ?? [];

                                return (
                                    <div key={lang.id}>
                                        <button
                                            onClick={() => handleSelectLanguage(lang.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-base border-2 transition-colors text-left ${
                                                isSelected
                                                    ? "border-main bg-main/5"
                                                    : "border-border bg-secondary-background hover:bg-main/5"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {lang.flag && (
                                                    <span className="text-lg">{lang.flag}</span>
                                                )}
                                                <div>
                                                    <div className="font-medium text-sm">{lang.name}</div>
                                                    <div className="text-[10px] text-foreground/50">
                                                        {getVoiceLabel(currentVoice)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-main" />
                                                )}
                                                <ChevronRight
                                                    className={`h-4 w-4 text-foreground/40 transition-transform ${
                                                        isExpanded ? "rotate-90" : ""
                                                    }`}
                                                />
                                            </div>
                                        </button>

                                        {/* Voice options */}
                                        {isExpanded && (
                                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-main/30 pl-3">
                                                <div className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider px-1 pt-1">
                                                    Select Voice
                                                </div>
                                                {langVoices.length > 0 ? (
                                                    langVoices.map((voice) => {
                                                        const isVoiceSelected = voice.name === currentVoice;
                                                        return (
                                                            <button
                                                                key={voice.name}
                                                                onClick={() => handleVoiceSelect(lang.id, voice.name)}
                                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-base border-2 transition-colors text-left ${
                                                                    isVoiceSelected
                                                                        ? "border-main bg-main/5"
                                                                        : "border-border/50 bg-secondary-background/50 hover:bg-main/5"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Volume2 className="h-3.5 w-3.5 text-foreground/50" />
                                                                    <span className="text-sm">{voice.label}</span>
                                                                    <span className="text-[10px] text-foreground/40 capitalize">
                                                                        {voice.gender}
                                                                    </span>
                                                                </div>
                                                                {isVoiceSelected && (
                                                                    <Check className="h-3.5 w-3.5 text-main" />
                                                                )}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-[10px] text-foreground/40 px-1 py-2">
                                                        No voices available
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {languages.length === 0 && (
                                <div className="text-center py-8 text-foreground/50 text-sm">
                                    No languages found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
