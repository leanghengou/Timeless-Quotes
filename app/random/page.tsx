
import { prismaDatabase } from "@/lib/prisma";
import Nav from "../Nav";
import DroppingStack from "../[author]/DroppingStack";
import "../[author]/quote-page-custom.css";


export default async function RandomQuotePage() {

   const quotes = await prismaDatabase.quote.findMany();
   const pickQuotes = quotes .sort(() => Math.random() - 0.5)



 const stackQuotes = pickQuotes
  .filter(item => item.approved)
  .map(item => ({
    text: item.text,
    author: item.author,
  }))
  

  return (

    <section className="relative min-h-screen overflow-hidden">

  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/media-assets/quote-page-video-bg-shorter.mp4" type="video/mp4" />
  </video>

  {/* Optional Overlay */}
  <div className="absolute inset-0 bg-black/40" />

  {/* Nav floats over the video so the stack stays centred in the viewport */}
  <div className="absolute inset-x-0 top-0 z-20">
    <Nav />
  </div>

  {/* Content: Osmo Dropping Cards Stack of the author's quotes */}
  <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
    <DroppingStack quotes={stackQuotes} />
  </div>


</section>

  );
}
