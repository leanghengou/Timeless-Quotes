import Image from "next/image";
import Link from "next/link";
import Nav from "../../../Nav";

export default function SenecaBio() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Nav />

      <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:items-start md:gap-16 md:py-24">
        <Image
          src="/media-assets/seneca-card.webp"
          alt="Seneca"
          width={400}
          height={578}
          priority
          className="h-auto w-64 shrink-0 md:w-80"
        />

        <div className="flex flex-col gap-8 text-center md:pt-2 md:text-left">
          <h1 className="text-4xl italic text-[var(--home-cream)] md:text-5xl">
            Seneca
          </h1>

          <p className="text-sm leading-6 text-[var(--home-cream)]/90">
            Born in Córdoba, Spain, Seneca trained in rhetoric and Stoic philosophy in Rome before a
            successful career as a lawyer and playwright brought him into imperial circles. Emperor
            Claudius exiled him to Corsica for eight years on adultery charges, but he was recalled
            to tutor the young Nero and became one of the most powerful men in Rome as
            Nero&rsquo;s advisor during the early, more stable years of his reign. His writings —
            including Letters to Lucilius, On the Shortness of Life, and several tragedies — blend
            Stoic ethics with practical advice on wealth, anger, grief, and death, making him one
            of the most accessible Stoic writers even today. His fortune (some sources estimate it
            was enormous) sat uneasily with his philosophy of simplicity, a contradiction critics
            have long noted. In 65 AD, Nero accused him of conspiracy in the Pisonian plot and
            ordered him to die by suicide. Seneca reportedly opened his veins and continued
            dictating philosophical thoughts to friends as he died, treating his own death as a
            final demonstration of Stoic principle.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/" className="btn">
              Other authors
            </Link>
            <Link href="/seneca" className="btn">
              Visit quotes
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}
