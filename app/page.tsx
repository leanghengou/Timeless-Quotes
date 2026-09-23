import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
import Tilt from "./Tilt";
import "./page-custom.css";
import { ViewTransition } from "react";

const authors = [
  { slug: "miyamoto-musashi", name: "Musashi", image: "/media-assets/musashi-card.webp", bio: "/bio/musashi/musashi" },
  { slug: "marcus-aurelius", name: "Marcus Aurelius", image: "/media-assets/marcus-aurelius-card.webp", bio: "/bio/musashi/marcus-aurelius" },
  { slug: "napoleon-bonaparte", name: "Napoleon", image: "/media-assets/napoleon-card.webp", bio: "/bio/musashi/napoleon" },
  { slug: "seneca", name: "Seneca", image: "/media-assets/seneca-card.webp", bio: "/bio/musashi/seneca" },
];

export default function Home() {
  return (

    <ViewTransition enter="page-in" exit="page-out" default="none">
    <div className="home">
      <Nav />

      <main className="home__main">
        <section className="home__intro">
          <p className="home__tagline">
            Share the words that move you. Post a quote and inspire the next generation.
          </p>
          <p className="home__tagline">
            <Link href="/submit-quote" className="home__link">Post a quote</Link> and share it with
            the community.
          </p>
        </section>

        <section aria-label="Authors">
          <ul className="home__authors">
            {authors.map((author) => (
              <li key={author.slug} className="author-card">
                <Tilt className="author-card__tilt">
                  <Link href={`/${author.slug}`} className="author-card__image-link">
                    <Image
                      className="author-card__image"
                      src={author.image}
                      alt={author.name}
                      width={400}
                      height={578}
                    />
                  </Link>
                </Tilt>

                <h2 className="author-card__name">
                  <Link href={`/${author.slug}`}>{author.name}</Link>
                </h2>
                <Link href={author.bio} className="author-card__bio">
                  Read bio
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
    </ViewTransition>
  );
}
