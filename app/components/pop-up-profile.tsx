"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Author profile pop-up.
// Opens when the author name (h3) on a quote card is clicked. Osmo clones the
// cards with cloneNode, which drops React handlers, so the trigger is a single
// delegated listener on the document instead of an onClick on each card.
// Mount once on any page that renders <DroppingStack />.

type Profile = {
  image: string;
  origin: string;
  blurb: string;
  bio?: string;
};

const profiles: Record<string, Profile> = {
  "Marcus Aurelius": {
    image: "/media-assets/marcus-aurelius-card.webp",
    origin: "Rome, Emperor",
    blurb: "Marcus ruled the Roman Empire for nineteen years and wrote Meditations as a private journal, never meant to be read.",
    bio: "/bio/musashi/marcus-aurelius",
  },
  "Seneca": {
    image: "/media-assets/seneca-card.webp",
    origin: "Rome, Stoic",
    blurb: "Seneca tutored the young Nero and became one of the richest men in Rome, while writing letters on how little we need.",
    bio: "/bio/musashi/seneca",
  },
  "Napoleon Bonaparte": {
    image: "/media-assets/napoleon-card.webp",
    origin: "France, Emperor",
    blurb: "Napoleon rose from an artillery officer to Emperor of the French and fought more than sixty battles across Europe.",
    bio: "/bio/musashi/napoleon",
  },
  "Miyamoto Musashi": {
    image: "/media-assets/musashi-card.webp",
    origin: "Japan, Swordsman",
    blurb: "Musashi fought his first duel at age 13 and reportedly never lost across more than 60 recorded contests.",
    bio: "/bio/musashi/musashi",
  },
  "Robert Greene": {
    image: "/media-assets/robert-greene-card.webp",
    origin: "United States, Author",
    blurb: "Often called the modern Machiavelli. Greene studies history to find the patterns behind power, ambition, and human behavior. His books, from The 48 Laws of Power to Mastery, have sold millions and are read by leaders, athletes, and artists around the world...",
  },
};

// Distance from the right edge of the screen
const EDGE = "2%";
const WIDTH = 240;

// Disabled below this width (Tailwind md) for now
const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

// `next` is the profile to show once the current one has faded out
type Open = { author: string; top: number; closing: boolean; next?: Open };

function positionNextTo(card: Element) {
  const rect = card.getBoundingClientRect();
  return {
    top: rect.top + rect.height / 2,
  };
}

export default function PopUpProfile() {
  const [open, setOpen] = useState<Open | null>(null);
  const cardRef = useRef<Element | null>(null);

  // Only the close button or a page / URL change closes it
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  const close = () => {
    cardRef.current = null;
    // Play the fade-out; the element unmounts on transitionend
    setOpen((prev) => prev && { ...prev, closing: true, next: undefined });
  };

  useEffect(() => {
    // Give author names that have a profile a clickable look (Osmo clones included)
    const mark = () =>
      document.querySelectorAll<HTMLElement>(".dropping-stack-card__content h3").forEach((el) => {
        if (profiles[el.textContent?.trim() ?? ""]) el.style.cursor = isMobile() ? "" : "pointer";
      });
    mark();
    const observer = new MutationObserver(mark);
    observer.observe(document.body, { childList: true, subtree: true });

    // One document listener, since cloned cards lose React onClick handlers
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const name = target.closest(".dropping-stack-card__content h3")?.textContent?.trim() ?? "";
      const card = target.closest(".dropping-stack-card");
      if (!profiles[name] || !card || isMobile()) return;

      cardRef.current = card;
      const next = { author: name, closing: false, ...positionNextTo(card) };
      // Switching authors: fade the current one out first, then bring the next in
      setOpen((prev) => (prev && prev.author !== name ? { ...prev, closing: true, next } : next));
    };
    // Zooming fires resize: follow the card instead of closing
    const onResize = () => {
      const card = cardRef.current;
      if (card) setOpen((prev) => prev && { ...prev, ...positionNextTo(card) });
    };

    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!open) return null;
  const profile = profiles[open.author];

  return (
    <div
      key={open.author}
      role="dialog"
      aria-label={`${open.author} profile`}
      onTransitionEnd={(e) => {
        // Ignore transitions bubbling up from the Read bio button
        if (e.target === e.currentTarget && open.closing) setOpen(open.next ?? null);
      }}
      // Enters right → left, leaves left → right
      className={`fixed z-[3000] flex max-md:hidden -translate-y-1/2 flex-col items-start text-[#EDE3CF] transition-[opacity,translate] starting:translate-x-3 starting:opacity-0 ${
        open.closing
          ? "pointer-events-none translate-x-3 opacity-0 duration-300 ease-[cubic-bezier(0.55,0,1,0.45)]"
          : "translate-x-0 opacity-100 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      }`}
      style={{ right: EDGE, top: open.top, width: WIDTH }}
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.image}
          alt={open.author}
          className="h-[156px] w-[108px] rounded-lg object-cover shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close profile"
          className="absolute -top-3 -right-3 flex size-7 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110"
        >
          <svg viewBox="0 0 14 14" className="size-3" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <p className="mt-4 text-sm leading-[1.6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        <strong className="font-bold text-white">{open.author}</strong>, {profile.origin}. {profile.blurb}
      </p>
      {profile.bio && (
        <Link href={profile.bio} className="btn mt-5 !px-7 !py-3 !text-base">
          Read bio
        </Link>
      )}
    </div>
  );
}
