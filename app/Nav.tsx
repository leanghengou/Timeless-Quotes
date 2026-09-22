"use client";

import { useState } from "react";
import Link from "next/link";
import "./nav.css";

const navLinks = [
  { href: "/random", label: "Random Quotes" },
  { href: "/submit-quote", label: "Submit a Quote" }
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-nav${open ? " is-open" : ""}`}>
      <Link href="/" className="site-nav__logo" onClick={() => setOpen(false)}>
        Timeless
      </Link>

      {/* Burger — only rendered visually on mobile via CSS */}
      <button
        type="button"
        className="site-nav__burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-nav-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="site-nav-menu" aria-label="Main" className="site-nav__menu">
        <ul className="site-nav__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="site-nav__link" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
