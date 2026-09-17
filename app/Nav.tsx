import Link from "next/link";
import "./nav.css";

const navLinks = [
  { href: "/daily-quote", label: "Daily Quote" },
  { href: "/random-quotes", label: "Random Quotes" },
  { href: "/membership", label: "Be a member" },
];

export default function Nav() {
  return (
    <header className="site-nav">
      <Link href="/" className="site-nav__logo">
        Timeless
      </Link>

      <nav aria-label="Main">
        <ul className="site-nav__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="site-nav__link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
