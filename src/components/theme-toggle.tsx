import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const toggle = () => {
    setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
