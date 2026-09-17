import { prismaDatabase } from "@/lib/prisma";
import "./quote-page-custom.css";


export default async function QuotePage({ params }: any) {
 const { author } = await params;
 const authorName = author.replaceAll('-', ' ').toLowerCase()

    const quotes = await prismaDatabase.quote.findMany();
    const authorRandomQuote = (quotes:any)=>{

         return quotes.filter((quote:any)=>{

             const searchedAuthor = quote.author.replaceAll('-', ' ').toLowerCase()
           return searchedAuthor === authorName
         }

           
        )
    }



    const authorQuotes = authorRandomQuote(quotes);
    const selectedQuotes = authorQuotes[Math.floor(Math.random()*authorQuotes.length)]


   

    
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

  {/* Content */}
  <div className="relative z-10 container mx-auto  card-paper-custom">
    <h2 className="text-4xl font-bold text-black leading-[1.2] italic">
      {selectedQuotes.text}
    </h2>


    <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">

   {selectedQuotes.author === "Marcus Aurelius" && (
  <img className="drop-shadow-lg" src="/media-assets/marcus-aurelius-card.webp" alt="Marcus Aurelius" width={80} height={100} />
)}

 {selectedQuotes.author === "Seneca" && (
  <img className="drop-shadow-lg" src="/media-assets/seneca-card.webp" alt="Marcus Aurelius" width={80} height={100} />
)}

 {selectedQuotes.author === "Napoleon Bonaparte" && (
  <img className="drop-shadow-lg" src="/media-assets/napoleon-card.webp" alt="Marcus Aurelius" width={80} height={100} />
)}

 {selectedQuotes.author === "Miyamoto Musashi" && (
  <img className="drop-shadow-lg" src="/media-assets/musashi-card.webp" alt="Marcus Aurelius" width={80} height={100} />
)}

    <h3 className="mt-4 text-xl text-black">
      {selectedQuotes.author}
    </h3>
    </div>
  </div>
</section>
   
  );
}
