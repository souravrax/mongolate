import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function SelectorButton({ children, className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button variant="surface" size="lg" className={cn("selector-button min-w-0 justify-between gap-3", className)} {...props}>
      <span className="truncate">{children}</span>
      <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
    </Button>
  );
}
