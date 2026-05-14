import { Toaster } from "@/components/ui/sonner";
import { Languages } from "lucide-react";
import Translator from "./components/translator";
import { ThemeToggle } from "./components/theme-toggle";

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-lg mx-auto space-y-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-base bg-main border-2 border-border shadow-shadow">
              <Languages className="w-6 h-6 text-main-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-instrument-serif font-semibold text-primary tracking-tight">Mongolate</h1>
              <p className="text-xs text-foreground/60 font-medium">Simple & fast translations</p>
            </div>
          </div>
          <ThemeToggle />
        </header>
        <Translator />
      </div>
      <Toaster />
    </div>
  );
}


export default App;
