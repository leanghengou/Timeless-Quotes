import Image from "next/image";
import Link from "next/link";
import Nav from "../../../Nav";

export default function MarcusAureliusBio() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Nav />

      <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:items-start md:gap-16 md:py-24">
        <Image
          src="/media-assets/marcus-aurelius-card.webp"
          alt="Marcus Aurelius"
          width={400}
          height={578}
          priority
          className="h-auto w-64 shrink-0 md:w-80"
        />

        <div className="flex flex-col gap-8 text-center md:pt-2 md:text-left">
          <h1 className="text-4xl italic text-[var(--home-cream)] md:text-5xl">
            Marcus Aurelius
          </h1>

          <p className="text-sm leading-6 text-[var(--home-cream)]/90">
            Adopted as heir by Emperor Antoninus Pius, Marcus Aurelius came to power in 161 AD and
            initially ruled jointly with his adoptive brother Lucius Verus. His reign was dominated
            by crisis: the Antonine Plague (likely smallpox) devastated the empire, and he spent
            years personally commanding legions against Germanic tribes along the Danube frontier.
            It was during these military campaigns, often in a tent on the front lines, that he
            wrote Meditations — not intended for publication, but as private philosophical notes to
            himself on maintaining virtue, patience, and perspective amid chaos. He drew heavily on
            Stoic teachers like Epictetus. Despite his philosophical temperament, he was a pragmatic
            ruler who dealt harshly with revolts and expanded persecution of early Christians. His
            succession is often seen as the end of Rome&rsquo;s &ldquo;golden age,&rdquo; since he
            broke from the tradition of adopting a capable heir and instead passed power to his
            biological son, the widely criticized Commodus.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/" className="btn">
              Other authors
            </Link>
            <Link href="/marcus-aurelius" className="btn">
              Visit quotes
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}
