import Image from "next/image";
import Link from "next/link";
import Nav from "../../../Nav";

export default function NapoleonBio() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Nav />

      <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:items-start md:gap-16 md:py-24">
        <Image
          src="/media-assets/napoleon-card.webp"
          alt="Napoleon Bonaparte"
          width={400}
          height={578}
          priority
          className="h-auto w-64 shrink-0 md:w-80"
        />

        <div className="flex flex-col gap-8 text-center md:pt-2 md:text-left">
          <h1 className="text-4xl italic text-[var(--home-cream)] md:text-5xl">
            Napoleon Bonaparte
          </h1>

          <p className="text-sm leading-7 text-[var(--home-cream)]/90">
            Born in Ajaccio, Corsica, to minor nobility, Napoleon trained at French military
            academies and rose rapidly during the chaos of the French Revolution, distinguishing
            himself at the Siege of Toulon in 1793. He seized political power in a 1799 coup,
            became First Consul, and crowned himself Emperor in 1804. Over the next decade he won a
            string of decisive victories (Austerlitz, Jena, Friedland) that made France the dominant
            power in Europe. His domestic legacy was arguably as significant as his military one:
            the Napoleonic Code standardized civil law and influenced legal systems worldwide, and
            he reformed education, banking, and infrastructure. His downfall began with the
            disastrous 1812 invasion of Russia, which cost hundreds of thousands of soldiers,
            followed by defeat at Leipzig in 1813 and exile to Elba. He escaped, returned to power
            for the &ldquo;Hundred Days,&rdquo; and was finally defeated at Waterloo in June 1815 by
            British and Prussian forces, ending his career in exile on the remote island of Saint
            Helena, where he died in 1821.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/" className="btn">
              Other authors
            </Link>
            <Link href="/napoleon-bonaparte" className="btn">
              Visit quotes
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}
