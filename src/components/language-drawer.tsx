import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Globe, Search, X, Check } from "lucide-react";
import { LANGUAGE_META, getLanguageName } from "@/lib/languages";
import { Input } from "./ui/input";

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

  const languages = useMemo(() => {
    const all = Object.keys(LANGUAGE_META).map((id) => ({
      id,
      ...LANGUAGE_META[id],
    }));
    const filtered = all.filter((l) => !excludeLangs.includes(l.id));
    if (!query.trim()) return filtered;
    const q = query.toLowerCase();
    return filtered.filter(
      (l) => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q),
    );
  }, [query, excludeLangs]);

  const handleSelectLanguage = (id: string) => {
    onSelect(id);
    setOpen(false);
    setQuery("");
  };

  const selectedName = getLanguageName(selectedLang);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 w-full px-0 font-semibold text-foreground hover:bg-transparent hover:translate-x-0 hover:translate-y-0 ${
            align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <span className="truncate">{selectedName}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="flex flex-row! items-center justify-between pb-2">
          <div className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {label}
            </DrawerTitle>
            <DrawerDescription className="text-left mt-1">
              Select a language
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Search */}
        <div className="px-4 pb-3">
          <Input
            type="text"
            placeholder="Search language..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            autoFocus
          />
        </div>

        {/* Language list */}
        <div className="px-4 pb-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-2">
              {languages.map((lang) => {
                const isSelected = lang.id === selectedLang;

                return (
                  <div
                    key={lang.id}
                    onClick={() => handleSelectLanguage(lang.id)}
                    className={`cursor-pointer border rounded-xl p-3 transition-colors ${
                      isSelected
                        ? "bg-accent"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {lang.flag && (
                          <span className="text-lg">{lang.flag}</span>
                        )}
                        <div className="font-medium text-sm">
                          {lang.name}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                );
              })}
              {languages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
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
