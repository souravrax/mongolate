import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function TranslationPanel({ tone = "source", className, ...props }: ComponentProps<"section"> & {
  tone?: "source" | "result";
}) {
  return (
    <section
      className={cn("translation-panel", tone === "result" && "translation-panel-result", className)}
      {...props}
    />
  );
}
