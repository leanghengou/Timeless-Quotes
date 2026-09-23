import Image from "next/image";
import Link from "next/link";
import Nav from "../../../Nav";

export default function MusashiBio() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Nav />

      <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:items-start md:gap-16 md:py-24">
        <Image
          src="/media-assets/musashi-card.webp"
          alt="Miyamoto Musashi"
          width={400}
          height={578}
          priority
          className="h-auto w-64 shrink-0 md:w-80"
        />

        <div className="flex flex-col gap-8 text-center md:pt-2 md:text-left">
          <h1 className="text-4xl italic text-[var(--home-cream)] md:text-5xl">
            Miyamoto Musashi
          </h1>

          <p className="text-sm leading-7 text-[var(--home-cream)]/90">
            Born in Harima Province, Japan, Musashi fought his first duel at age 13 and reportedly
            never lost across more than 60 recorded contests. His most famous duel was against
            Sasaki Kojirō on Ganryū Island in 1612, which he won using a wooden sword carved from
            an oar. He founded the Hyōhō Niten Ichi-ryū school, which taught fighting with two
            swords simultaneously — a technique drawn from his observation that samurai typically
            carried both a long and short sword but rarely used them together in combat. In his
            final years, he retreated to a cave to write The Book of Five Rings (Go Rin no Sho),
            organizing his philosophy of strategy into five &ldquo;books&rdquo; named after earth,
            water, fire, wind, and void. Beyond swordsmanship, he was also an accomplished painter
            and calligrapher, and his ink paintings of birds and nature are still preserved in
            Japanese museums today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/" className="btn">
              Other authors
            </Link>
            <Link href="/miyamoto-musashi" className="btn">
              Visit quotes
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}
