import { useState } from "react";
import { useHistoryStore } from "@/store/history-store";
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
import { History, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface HistoryDrawerProps {
  onSelectItem?: (sourceText: string, sourceLang: string, targetLang: string) => void;
}

export function HistoryDrawer({ onSelectItem }: HistoryDrawerProps) {
  const { history, removeItem, clearHistory } = useHistoryStore();
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    clearHistory();
    toast.success("History cleared");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(id);
    toast.success("Item removed");
  };

  const handleSelect = (item: (typeof history)[number]) => {
    onSelectItem?.(item.sourceText, item.sourceLang, item.targetLang);
    setOpen(false);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="neutral" size="icon">
          <History className="h-5 w-5" />
          <span className="sr-only">History</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="flex items-center justify-between pb-2">
          <DrawerTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </DrawerTitle>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button variant="neutral" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="neutral" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 flex-1 overflow-hidden">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-foreground/50 gap-2">
              <History className="h-8 w-8 opacity-50" />
              <p className="text-sm">No history yet</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-3 rounded-base border-2 border-border bg-secondary-background hover:bg-main/5 transition-colors group relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
                        {item.sourceLang} → {item.targetLang}
                      </span>
                      <span className="text-[10px] text-foreground/40">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2 text-foreground">
                      {item.sourceText}
                    </p>
                    <p className="text-sm text-foreground/70 line-clamp-2 mt-1">
                      {item.translatedText}
                    </p>
                    <Button
                      variant="neutral"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={(e) => handleDelete(item.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
