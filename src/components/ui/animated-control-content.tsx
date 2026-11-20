import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";

interface AnimatedControlContentProps {
  stateKey: string;
  instant?: boolean;
  children: ReactNode;
}

export function AnimatedControlContent({ stateKey, instant = false, children }: AnimatedControlContentProps) {
  const reducedMotion = useReducedMotion();

  if (instant) {
    return <span className="action-content" aria-hidden="true">{children}</span>;
  }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <m.span
        key={stateKey}
        className="action-content"
        aria-hidden="true"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -2 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.14, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </m.span>
    </AnimatePresence>
  );
}
