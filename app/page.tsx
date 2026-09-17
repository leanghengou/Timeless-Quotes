import Image from "next/image";
import "./page-custom.css";
import Link from "next/link";


export default function Home() {
  return (
    <div
     style={{backgroundImage: `url('/media-assets/homepage-background.webp')`,}}
    className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black bg-cover bg-center">
      <main className="w-fit">
        <section>
  <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 p-20">
  <li>
    <Link href="/marcus-aurelius"> 
    <Image className="w-full drop-shadow-md cursor-pointer" src="/media-assets/marcus-aurelius-card.webp" 
    alt="Marcus Aurelius"
  width={400}
  height={600}/>
   </Link>

  <h2></h2>
  
  </li>
  <li>
    <Link href="/miyamoto-musashi">
    <Image className="w-full drop-shadow-md cursor-pointer" src="/media-assets/musashi-card.webp" alt="Musashi"  width={400}
  height={600}/>
    </Link>
    </li>

  <li>
    
    <Link href="/napoleon-bonaparte"><Image className="w-full drop-shadow-md cursor-pointer" src="/media-assets/napoleon-card.webp" alt="Napoleon"   width={400}
  height={600}/></Link></li>
  <li>
    <Link href="/seneca">
    
    <Image  className="w-full drop-shadow-md cursor-pointer" src="/media-assets/seneca-card.webp"alt="Seneca"  width={400}
  height={600} /></Link></li>

 </ul>
</section>
      </main>
    </div>
  );
}
