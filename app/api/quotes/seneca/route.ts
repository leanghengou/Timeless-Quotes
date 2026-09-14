import { prismaDatabase } from "@/lib/prisma";

export async function GET(){

   const quotes = await prismaDatabase.quote.findMany();
const selectAuthor =  quotes.filter((author) => author.author  === "Marcus Aurelius");

   const randomQuote = selectAuthor[Math.floor(Math.random()*selectAuthor.length)]

    return Response.json(randomQuote);
}