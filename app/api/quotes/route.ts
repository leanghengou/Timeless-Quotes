import { prismaDatabase } from "@/lib/prisma";

export async function POST(request:any){
     const body = await request.json();
      const { text, author} = body;
     
if(typeof text !== 'string' || text.length < 5 || text.length > 300){
  return Response.json({error:"Quote must be 5-300 characters."},{status:400})
}

if(typeof author !== 'string' || author.length < 1 || author.length > 100){
  return Response.json({error:"Author must be 1-100 characters."},{status:400})
}

 const submitQuote = await prismaDatabase.quote.create({
        data:{text ,author }
      })

      
  return Response.json(submitQuote, { status: 201 })
}