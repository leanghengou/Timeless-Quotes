"use client";

import { useEffect, useRef } from "react";
import VanillaTilt, { type HTMLVanillaTiltElement, type TiltOptions } from "vanilla-tilt";

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  options?: TiltOptions;
};

const defaultOptions: TiltOptions = {
  max: 12,
  speed: 400,
  scale: 1.04,
  perspective: 900,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

// Wraps children in a 3D tilt-on-hover element (vanilla-tilt)
export default function Tilt({ children, className, options }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current as HTMLVanillaTiltElement | null;
    if (!el) return;

    VanillaTilt.init(el, { ...defaultOptions, ...options });

    return () => {
      const tilt = el.vanillaTilt as
        | (VanillaTilt & { removeEventListeners(): void })
        | undefined;
      if (!tilt) return;
      // vanilla-tilt's mouseleave schedules an uncancelled reset on the next frame;
      // destroying immediately nulls its element and that reset crashes. Stop
      // listening now, destroy after any pending reset has run.
      tilt.removeEventListeners();
      requestAnimationFrame(() => tilt.destroy());
    };
  }, [options]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
