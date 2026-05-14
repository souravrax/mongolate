import { Toaster } from "@/components/ui/sonner";
import { Languages } from "lucide-react";
import Translator from "./components/translator";
import { ThemeToggle } from "./components/theme-toggle";
import { HistoryDrawer } from "./components/history-drawer";

function App() {
  const handleHistorySelect = (
    sourceText: string,
    sourceLang: string,
    targetLang: string,
  ) => {
    // Force re-mount translator with new initial values
    // A better approach would be lifting state, but for simplicity we'll just reload the page
    // or use a more sophisticated state approach. Instead, let's use URL params or global event.
    // For now, let's just use a global event on window.
    window.dispatchEvent(
      new CustomEvent("load-translation", {
        detail: { sourceText, sourceLang, targetLang },
      }),
    );
  };

  return (
    <div className="h-[100dvh] font-google flex flex-col bg-background overflow-hidden">
      <header className="shrink-0 z-40 bg-background">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-base bg-main border-2 border-border shadow-shadow">
              <Languages className="w-5 h-5 text-main-foreground" />
            </div>
            <h1 className="text-xl font-instrument-serif font-semibold text-primary tracking-tight">
              Mongolate
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <HistoryDrawer onSelectItem={handleHistorySelect} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 max-w-2xl mx-auto w-full px-2 py-1">
        <Translator />
      </main>

      <Toaster />
    </div>
  );
}

export default App;
