import { prismaDatabase } from "@/lib/prisma";

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


     console.log(
    "textpage Prisma Database", selectedQuotes
    )

    
  return (
    <div>
        <h2>{selectedQuotes.text}</h2>
        <h3>{selectedQuotes.author}</h3>
    </div>
  );
}
