export const dynamic = "force-dynamic";
import { prismaDatabase } from "@/lib/prisma";

export async function GET(){

   const quotes = await prismaDatabase.quote.findMany();
   const randomQuote = quotes[Math.floor(Math.random()*quotes.length)]

    return Response.json(randomQuote);
}