"use client";

// GSAP is loaded from the CDN (not installed from npm), so its globals are untyped.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

// Osmo "Dropping Cards Stack"
// GSAP + Draggable + CustomEase are loaded from the CDN on mount, then the
// stack is initialised on this component's root element.

const GSAP_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/Draggable.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/CustomEase.min.js",
];

declare global {
  interface Window {
    gsap: any;
    Draggable: any;
    CustomEase: any;
  }
}

export type Quote = { text: string; author: string };

const authorPortraits: Record<string, string> = {
  "Marcus Aurelius": "/media-assets/marcus-aurelius-card.webp",
  "Seneca": "/media-assets/seneca-card.webp",
  "Napoleon Bonaparte": "/media-assets/napoleon-card.webp",
  "Miyamoto Musashi": "/media-assets/musashi-card.webp",
};

// Loads a script once; resolves immediately if it's already on the page.
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing?.dataset.loaded === "true") return resolve();

    const el = existing ?? document.createElement("script");
    el.addEventListener("load", () => {
      el.dataset.loaded = "true";
      resolve();
    });
    el.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));

    if (!existing) {
      el.src = src;
      el.async = false;
      document.head.appendChild(el);
    }
  });
}

async function loadGsap() {
  for (const src of GSAP_SCRIPTS) await loadScript(src);
  const { gsap, Draggable, CustomEase } = window;
  gsap.registerPlugin(Draggable, CustomEase);
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
}

// Osmo init, scoped to one stack element. Returns a cleanup function.
function initDroppingCardsStack(stackEl: HTMLElement): () => void {
  const { gsap, Draggable } = window;

  // Settings
  const visibleCount = 3;
  const minTotalForLoop = 5;
  const duration = 0.75;
  const mainEase = "osmo";
  const dragThresholdPercent = 20;

  const getUnitValue = (val: string, depth: number) => {
    const num = parseFloat(val) || 0;
    const unit = String(val).replace(/[0-9.-]/g, "") || "px";
    return num * depth + unit;
  };

  const nextBtn = stackEl.querySelector("[data-dropping-stack-next]");
  const prevBtn = stackEl.querySelector("[data-dropping-stack-prev]");

  const list = stackEl.querySelector(".dropping-stack__list")!;
  let cards = Array.from(list.querySelectorAll<HTMLElement>("[data-dropping-stack-item]"));
  // Osmo clones cards up to 5 below, so even 1–2 quotes still form a stack
  if (!cards.length) return () => {};

  const originalCount = cards.length;
  if (cards.length < minTotalForLoop) {
    const setsNeeded = Math.ceil(minTotalForLoop / originalCount);
    const clonesToAdd = setsNeeded * originalCount - originalCount;

    for (let i = 0; i < clonesToAdd; i++) {
      const clone = cards[i % originalCount].cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      list.appendChild(clone);
    }

    cards = Array.from(list.querySelectorAll<HTMLElement>("[data-dropping-stack-item]"));
  }

  const total = cards.length;
  let activeIndex = 0;
  let isAnimating = false;

  let dragCard: HTMLElement | null = null;
  let draggableInstance: any = null;

  let limitX = 1;
  let limitY = 1;

  let offsetX = "0em";
  let offsetY = "0em";

  let isActive = false;

  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const cardAt = (offset: number) => cards[mod(activeIndex + offset, total)];

  function updateOffsetsFromPadding() {
    const collectionEl = stackEl.querySelector("[data-dropping-stack-collection]");
    if (!collectionEl) return;

    const styles = getComputedStyle(collectionEl);

    const padRight = parseFloat(styles.paddingRight) || 0;
    const padLeft = parseFloat(styles.paddingLeft) || 0;

    const padBottom = parseFloat(styles.paddingBottom) || 0;
    const padTop = parseFloat(styles.paddingTop) || 0;

    const steps = Math.max(1, visibleCount - 1);

    const usePadX = Math.max(padRight, padLeft);
    const usePadY = Math.max(padBottom, padTop);

    const signX = padLeft > padRight ? -1 : 1;
    const signY = padTop > padBottom ? -1 : 1;

    const xStep = (usePadX / steps) * signX;
    const yStep = (usePadY / steps) * signY;

    offsetX = xStep + "px";
    offsetY = yStep + "px";
  }

  function updateDragLimits() {
    if (!dragCard) return;
    const cardRect = dragCard.getBoundingClientRect();
    limitX = cardRect.width || 1;
    limitY = cardRect.height || 1;
  }

  // Sets cards to their static stack positions
  function applyState() {
    updateOffsetsFromPadding();

    cards.forEach((card) => {
      gsap.set(card, {
        opacity: 0,
        pointerEvents: "none",
        zIndex: 0,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
      });
    });

    for (let depth = 0; depth < visibleCount; depth++) {
      const card = cardAt(depth);
      const xVal = getUnitValue(offsetX, depth);
      const yVal = getUnitValue(offsetY, depth);

      const state: any = {
        opacity: 1,
        zIndex: 999 - depth,
        pointerEvents: depth === 0 ? "auto" : "none",
      };

      if (offsetX.includes("%")) state.xPercent = parseFloat(xVal); else state.x = xVal;
      if (offsetY.includes("%")) state.yPercent = parseFloat(yVal); else state.y = yVal;

      gsap.set(card, state);
    }

    dragCard = cardAt(0);
    gsap.set(dragCard, { touchAction: "none" });

    updateDragLimits();

    if (draggableInstance) {
      draggableInstance.kill();
      draggableInstance = null;
    }

    const magnetize = (raw: number, limit: number) => {
      const sign = Math.sign(raw) || 1;
      const abs = Math.abs(raw);
      const out = limit * Math.tanh(abs / limit);
      return sign * out;
    };

    draggableInstance = Draggable.create(dragCard, {
      type: "x,y",
      inertia: false,
      onPress: function () {
        if (isAnimating) return;
        gsap.killTweensOf(dragCard);
        gsap.set(dragCard, { zIndex: 2000, opacity: 1 });
      },
      onDrag: function (this: any) {
        if (isAnimating) return;

        const x = magnetize(this.x, limitX);
        const y = magnetize(this.y, limitY);

        gsap.set(dragCard, { x, y, opacity: 1 });
      },
      onRelease: function () {
        if (isAnimating) return;

        const currentX = gsap.getProperty(dragCard, "x");
        const currentY = gsap.getProperty(dragCard, "y");

        const movedXPercent = (Math.abs(currentX) / limitX) * 100;
        const movedYPercent = (Math.abs(currentY) / limitY) * 100;
        const movedPercent = Math.max(movedXPercent, movedYPercent);

        if (movedPercent >= dragThresholdPercent) {
          animateNext(true, currentX, currentY);
          return;
        }

        // Move back to stack if treshold is not reached
        gsap.to(dragCard, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.7)",
          onComplete: () => {
            applyState();
          },
        });
      },
    })[0];
  }

  function animateNext(fromDrag = false, releaseX = 0, releaseY = 0) {
    if (isAnimating) return;
    isAnimating = true;

    const outgoing = cardAt(0);
    const incomingBack = cardAt(visibleCount);
    const tl = gsap.timeline({
      defaults: { duration, ease: mainEase },
      onComplete: () => {
        activeIndex = mod(activeIndex + 1, total);
        applyState();
        isAnimating = false;
      },
    });

    gsap.set(outgoing, { zIndex: 2000, opacity: 1 });
    if (fromDrag) gsap.set(outgoing, { x: releaseX, y: releaseY });

    // Next: Move top card down and fade it out late
    tl.to(outgoing, { yPercent: 200 }, 0);
    tl.to(outgoing, { opacity: 0, duration: duration * 0.2, ease: "none" }, duration * 0.4);

    // Next: Shift existing stack cards forward
    for (let depth = 1; depth < visibleCount; depth++) {
      const xVal = getUnitValue(offsetX, depth - 1);
      const yVal = getUnitValue(offsetY, depth - 1);
      const move: any = { zIndex: 999 - (depth - 1) };

      if (offsetX.includes("%")) move.xPercent = parseFloat(xVal); else move.x = xVal;
      if (offsetY.includes("%")) move.yPercent = parseFloat(yVal); else move.y = yVal;

      tl.to(cardAt(depth), move, 0);
    }

    // Next: Bring new card in from the "invisible" position
    const backX = getUnitValue(offsetX, visibleCount);
    const backY = getUnitValue(offsetY, visibleCount);
    const startX = getUnitValue(offsetX, visibleCount - 1);
    const startY = getUnitValue(offsetY, visibleCount - 1);

    const incomingSet: any = { opacity: 0, zIndex: 999 - visibleCount };
    if (offsetX.includes("%")) incomingSet.xPercent = parseFloat(backX); else incomingSet.x = backX;
    if (offsetY.includes("%")) incomingSet.yPercent = parseFloat(backY); else incomingSet.y = backY;
    gsap.set(incomingBack, incomingSet);

    const incomingTo: any = { opacity: 1 };
    if (offsetX.includes("%")) incomingTo.xPercent = parseFloat(startX); else incomingTo.x = startX;
    if (offsetY.includes("%")) incomingTo.yPercent = parseFloat(startY); else incomingTo.y = startY;
    tl.to(incomingBack, incomingTo, 0);
  }

  function animatePrev() {
    if (isAnimating) return;
    isAnimating = true;

    const incomingTop = cardAt(-1);
    const leavingBack = cardAt(visibleCount - 1);
    const tl = gsap.timeline({
      defaults: { duration, ease: mainEase },
      onComplete: () => {
        activeIndex = mod(activeIndex - 1, total);
        applyState();
        isAnimating = false;
      },
    });

    gsap.set(leavingBack, { zIndex: 1 });

    // Prev: Move a card from top-offset to active position
    gsap.set(incomingTop, { opacity: 0, x: 0, xPercent: 0, yPercent: -200, zIndex: 2000 });
    tl.to(incomingTop, { yPercent: 0 }, 0);
    tl.to(incomingTop, { opacity: 1, duration: duration * 0.2, ease: "none" }, duration * 0.3);

    // Prev: Push current stack cards back one level
    for (let depth = 0; depth < visibleCount - 1; depth++) {
      const xVal = getUnitValue(offsetX, depth + 1);
      const yVal = getUnitValue(offsetY, depth + 1);
      const move: any = { zIndex: 999 - (depth + 1) };

      if (offsetX.includes("%")) move.xPercent = parseFloat(xVal); else move.x = xVal;
      if (offsetY.includes("%")) move.yPercent = parseFloat(yVal); else move.y = yVal;

      tl.to(cardAt(depth), move, 0);
    }

    // Prev: Slide the back-most card into the "invisible" position
    const backX = getUnitValue(offsetX, visibleCount);
    const backY = getUnitValue(offsetY, visibleCount);
    const hideBack: any = { opacity: 0 };
    if (offsetX.includes("%")) hideBack.xPercent = parseFloat(backX); else hideBack.x = backX;
    if (offsetY.includes("%")) hideBack.yPercent = parseFloat(backY); else hideBack.y = backY;
    tl.to(leavingBack, hideBack, 0);
  }

  // Keyboard Arrow controls next/prev
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isActive = entry.isIntersecting && entry.intersectionRatio >= 0.6;
      });
    },
    { threshold: [0, 0.6, 1] }
  );

  observer.observe(stackEl);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!isActive) return;
    if (isAnimating) return;

    const target = e.target as HTMLElement | null;
    const tag = target?.tagName ? target.tagName.toLowerCase() : "";
    const isTyping = tag === "input" || tag === "textarea" || tag === "select" || !!target?.isContentEditable;
    if (isTyping) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      animateNext(false);
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      animatePrev();
    }
  };

  const onNext = () => animateNext(false);
  const onResize = () => applyState();

  window.addEventListener("keydown", onKeyDown);

  applyState();

  if (nextBtn) nextBtn.addEventListener("click", onNext);
  if (prevBtn) prevBtn.addEventListener("click", animatePrev);

  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
    if (nextBtn) nextBtn.removeEventListener("click", onNext);
    if (prevBtn) prevBtn.removeEventListener("click", animatePrev);
    observer.disconnect();
    if (draggableInstance) draggableInstance.kill();
    gsap.killTweensOf(cards);
  };
}

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 18" fill="none" className="dropping-stack__control-svg">
    <path d="M6.74976 14.25L11.9998 9L6.74976 3.75" stroke="currentColor" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DroppingStack({ quotes }: { quotes: Quote[] }) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stackEl = stackRef.current;
    if (!stackEl) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadGsap()
      .then(() => {
        if (!cancelled) cleanup = initDroppingCardsStack(stackEl);
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [quotes]);

  return (
    <div ref={stackRef} data-dropping-stack-init="" className="dropping-stack">
      <div data-dropping-stack-collection="" className="dropping-stack__collection">
        <div className="dropping-stack__list">
          {quotes.map((quote, i) => (
            <div key={i} data-dropping-stack-item="" className="dropping-stack__item">
              <div className="dropping-stack-card">
                <div className="dropping-stack-card__before"></div>
                <div className="dropping-stack-card__content">
                  <div className="dropping-stack-card__quote">
                    <span className="dropping-stack-card__mark" aria-hidden="true">&ldquo;</span>
                    <h2 className="text-4xl font-medium text-black leading-[1.3] italic">
                      {quote.text}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    {authorPortraits[quote.author] && (
                      <img
                        className="drop-shadow-lg"
                        src={authorPortraits[quote.author]}
                        alt={quote.author}
                        width={80}
                        height={100}
                        draggable={false}
                      />
                    )}
                    <h3 className="text-xl text-black">{quote.author}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dropping-stack__controls">
        <div data-dropping-stack-prev="" className="dropping-stack__control is--prev">
          <div className="dropping-stack__control-circle is--prev">
            <ChevronIcon />
          </div>
        </div>
        <div data-dropping-stack-next="" className="dropping-stack__control">
          <div className="dropping-stack__control-circle">
            <ChevronIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
