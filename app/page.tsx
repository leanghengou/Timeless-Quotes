import Image from "next/image";
import "./page-custom.css";
import Link from "next/link";
import marcusImg from "./media-assets/marcus-aurelius-card.webp";
import musashiImg from "./media-assets/musashi-card.webp";
import napoleonImg from "./media-assets/napoleon-card.webp";
import senecaImg from "./media-assets/seneca-card.webp";
import bgImage from "./media-assets/homepage-background.webp";

export default function Home() {
  return (
    <div
     style={{backgroundImage: `url(${bgImage.src})`,}}
    className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black bg-cover bg-center">
      <main className="w-fit">
        <section>
  <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 p-20">
  <li>
    <Link href="/marcus-aurelius"> <Image className="w-full drop-shadow-md cursor-pointer" src={marcusImg} alt="Marcus Aurelius" />
   </Link>

  <h2></h2>
  
  </li>
  <li>
    <Link href="/miyamoto-musashi">
    <Image className="w-full drop-shadow-md cursor-pointer" src={musashiImg} alt="Musashi" />
    </Link>
    </li>

  <li>
    
    <Link href="/napoleon-bonaparte"><Image className="w-full drop-shadow-md cursor-pointer" src={napoleonImg} alt="Napoleon" /></Link></li>
  <li>
    <Link href="/seneca">
    <Image className="w-full drop-shadow-md cursor-pointer" src={senecaImg} alt="Seneca" /></Link></li>

 </ul>
</section>
      </main>
    </div>
  );
}
