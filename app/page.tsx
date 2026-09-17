import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
import "./page-custom.css";

const authors = [
  { slug: "miyamoto-musashi", name: "Musashi", image: "/media-assets/musashi-card.webp" },
  { slug: "marcus-aurelius", name: "Marcus Aurelius", image: "/media-assets/marcus-aurelius-card.webp" },
  { slug: "napoleon-bonaparte", name: "Napoleon", image: "/media-assets/napoleon-card.webp" },
  { slug: "seneca", name: "Seneca", image: "/media-assets/seneca-card.webp" },
];

export default function Home() {
  return (
    <div className="home">
      <Nav />

      <main className="home__main">
        <section className="home__intro">
          <p className="home__tagline">
            The platform built to inspired and motivated youths.
          </p>
          <p className="home__tagline">
            <Link href="/membership" className="home__link">Become a member</Link> to save your
            favorites quotes.
          </p>
        </section>

        <section aria-label="Authors">
          <ul className="home__authors">
            {authors.map((author) => (
              <li key={author.slug} className="author-card">
                <Link href={`/${author.slug}`} className="author-card__image-link">
                  <Image
                    className="author-card__image"
                    src={author.image}
                    alt={author.name}
                    width={400}
                    height={578}
                  />
                </Link>

                <h2 className="author-card__name">
                  <Link href={`/${author.slug}`}>{author.name}</Link>
                </h2>
                <Link href={`/${author.slug}/bio`} className="author-card__bio">
                  Read bio
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
