"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function SubmitMessage({
  message,
  isError,
  onClose,
}: {
  message: string;
  isError: boolean;
  onClose: () => void;
  // onClose a common property, event handler, or callback in programming used to execute code when a component, connection, window, or object is closed or dismissed
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power1.out" }
    );

    gsap.fromTo(
      paperRef.current,
      { opacity: 0, scale: 0.7, rotate: -4 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" }
    );
  }, [message]);

  if (!message) return null;

  return (
    <div className="submit-message" ref={overlayRef}>
      <div className="submit-message__paper" ref={paperRef}>
        <p className="submit-message__text">{message}</p>
        {isError ? (
          <button type="button" className="submit-message__link" onClick={onClose}>
            Back to submit a quote
          </button>
        ) : (
          <Link href="/" className="btn">
            Back to homepage
          </Link>
        )}
      </div>
    </div>
  );
}
