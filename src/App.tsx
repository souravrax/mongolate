import { Toaster } from "@/components/ui/sonner";
import Translator from "./components/translator";
import { ThemeToggle } from "./components/theme-toggle";
import { HistoryDrawer } from "./components/history-drawer";

function App() {
  const handleHistorySelect = (
    sourceText: string,
    sourceLang: string,
    targetLang: string,
  ) => {
    window.dispatchEvent(
      new CustomEvent("load-translation", {
        detail: { sourceText, sourceLang, targetLang },
      }),
    );
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="wordmark">Mongolate</h1>
        <nav className="flex items-center gap-1 sm:gap-3" aria-label="App controls">
          <HistoryDrawer onSelectItem={handleHistorySelect} />
          <ThemeToggle />
        </nav>
      </header>
      <main className="app-main">
        <Translator />
      </main>

      <Toaster />
    </div>
  );
}

export default App;
