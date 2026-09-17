import { prismaDatabase } from "@/lib/prisma";
import DroppingStack from "./DroppingStack";
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
    const startIndex = Math.floor(Math.random()*authorQuotes.length)

    // Rotate so the randomly chosen quote is the top card of the stack
    const stackQuotes = [...authorQuotes.slice(startIndex), ...authorQuotes.slice(0, startIndex)]
      .map((quote:any) => ({ text: quote.text, author: quote.author }))



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

  {/* Content: Osmo Dropping Cards Stack of the author's quotes */}
  <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
    <DroppingStack quotes={stackQuotes} />
  </div>
</section>

  );
}
