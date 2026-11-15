"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useSectionInView } from "./useSectionInView";
import "./section-backgrounds.css";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Absolute inset-0 layer behind section content.
 * pointer-events:none · aria-hidden · pauses child CSS when off-screen.
 */
export function SectionBackground({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(ref);

  return (
    <div
      ref={ref}
      className={cn(
        "section-bg",
        inView ? "section-bg--active" : "section-bg--paused",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
