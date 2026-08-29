"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP);

export function VerdictChoreography({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      const mark = "[data-verdict-part='mark']";
      const status = "[data-verdict-part='status']";
      const reason = "[data-verdict-part='reason']";
      const comparisons = "[data-verdict-part='comparison']";
      const action = "[data-verdict-part='action']";
      const parts = gsap.utils.toArray<HTMLElement>(
        `${mark}, ${status}, ${reason}, ${comparisons}, ${action}`,
      );

      gsap.set(parts, { willChange: "transform, opacity" });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            gsap.set(parts, { clearProps: "transform,opacity,willChange" });
          },
        })
        .from(mark, { opacity: 0, y: 4, duration: 0.18 }, 0)
        .from(status, { opacity: 0, y: 8, duration: 0.32 }, 0.02)
        .from(reason, { opacity: 0, y: 6, duration: 0.22 }, 0.08)
        .from(
          comparisons,
          { opacity: 0, y: 8, duration: 0.24, stagger: 0.045 },
          0.14,
        )
        .from(action, { opacity: 0, y: 6, duration: 0.2 }, 0.26);
    },
    {
      scope: containerRef,
      dependencies: [shouldReduceMotion],
      revertOnUpdate: true,
    },
  );

  return <div ref={containerRef}>{children}</div>;
}
