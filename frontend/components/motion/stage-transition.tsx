"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const easeOut = [0.23, 1, 0.32, 1] as const;

type StageTransitionProps = {
  children: ReactNode;
  stageIndex: number;
  stageKey: string;
};

type StageFrameProps = StageTransitionProps & {
  direction: 1 | -1;
  shouldFocus: boolean;
};

function StageFrame({
  children,
  direction,
  shouldFocus,
}: Omit<StageFrameProps, "stageIndex" | "stageKey">) {
  const frameRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldFocus) return;

    const frame = requestAnimationFrame(() => {
      frameRef.current
        ?.querySelector<HTMLElement>("[data-stage-heading]")
        ?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [shouldFocus]);

  const variants = {
    initial: (transitionDirection: 1 | -1) =>
      shouldReduceMotion
        ? { opacity: 1, transform: "none" }
        : {
            opacity: 0,
            transform: `translateY(${transitionDirection * 10}px)`,
          },
    animate: {
      opacity: 1,
      transform: "translateY(0px)",
      pointerEvents: "auto" as const,
    },
    exit: (transitionDirection: 1 | -1) =>
      shouldReduceMotion
        ? {
            opacity: 1,
            transform: "none",
            pointerEvents: "none" as const,
            transition: { duration: 0 },
          }
        : {
            opacity: 0,
            transform: `translateY(${transitionDirection * -6}px)`,
            pointerEvents: "none" as const,
            transition: { duration: 0.12, ease: easeOut },
          },
  };

  return (
    <motion.div
      ref={frameRef}
      className="stage-motion-frame"
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.18, ease: easeOut }
      }
    >
      {children}
    </motion.div>
  );
}

export function StageTransition({
  children,
  stageIndex,
  stageKey,
}: StageTransitionProps) {
  const previousIndex = useRef(stageIndex);
  const hasMounted = useRef(false);
  const direction: 1 | -1 = stageIndex >= previousIndex.current ? 1 : -1;
  const shouldFocus = hasMounted.current;

  useEffect(() => {
    previousIndex.current = stageIndex;
    hasMounted.current = true;
  }, [stageIndex]);

  return (
    <AnimatePresence initial={false} mode="wait" custom={direction}>
      <StageFrame
        key={stageKey}
        direction={direction}
        shouldFocus={shouldFocus}
      >
        {children}
      </StageFrame>
    </AnimatePresence>
  );
}
