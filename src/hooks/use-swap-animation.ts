import { useLayoutEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

export function useSwapAnimation(
  workspaceRef: RefObject<HTMLDivElement | null>,
  swapCount: number,
  enabled: boolean,
) {
  const reducedMotion = useReducedMotion();
  const previousSwap = useRef(swapCount);

  useLayoutEffect(() => {
    if (swapCount === previousSwap.current) return;
    previousSwap.current = swapCount;
    if (!swapCount || !enabled) return;
    const source = workspaceRef.current?.querySelector<HTMLElement>(".source-panel");
    const result = workspaceRef.current?.querySelector<HTMLElement>(".result-panel");
    if (!source || !result) return;

    const sourceRect = source.getBoundingClientRect();
    const resultRect = result.getBoundingClientRect();
    const deltaX = resultRect.x - sourceRect.x;
    const deltaY = resultRect.y - sourceRect.y;
    const vertical = Math.abs(deltaY) > Math.abs(deltaX);

    const animations = [source, result].map((card, index) => {
      const direction = index === 0 ? 1 : -1;
      const x = deltaX * direction;
      const y = deltaY * direction;
      const keyframes: Keyframe[] = reducedMotion
        ? [{ opacity: 0.65 }, { opacity: 1 }]
        : [
            {
              transform: `translate(${x}px, ${y}px) rotate(${-3 * direction}deg) scale(0.97)`,
              opacity: 0.9,
              zIndex: index === 0 ? 1 : 0,
            },
            {
              transform: `translate(${x * 0.35 + (vertical ? -18 * direction : 0)}px, ${y * 0.35 + (vertical ? 0 : -18 * direction)}px) rotate(${direction}deg) scale(1.01)`,
              opacity: 1,
              zIndex: index === 0 ? 1 : 0,
              offset: 0.55,
            },
            { transform: "none", opacity: 1, zIndex: index === 0 ? 1 : 0 },
          ];
      const animation = card.animate(keyframes, {
        duration: reducedMotion ? 100 : 480,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "both",
      });
      animation.addEventListener("finish", () => animation.cancel(), { once: true });
      return animation;
    });

    const cancel = () => animations.forEach((animation) => animation.cancel());
    window.addEventListener("resize", cancel);
    return () => {
      cancel();
      window.removeEventListener("resize", cancel);
    };
  }, [workspaceRef, swapCount, enabled, reducedMotion]);
}
