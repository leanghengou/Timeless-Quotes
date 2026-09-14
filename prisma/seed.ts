import { PrismaClient } from "@prisma/client";
import { quotes } from "./quotes";

const prismaReuse = new PrismaClient();

async function main() {
  await prismaReuse.quote.deleteMany();
  await prismaReuse.quote.createMany({ data: quotes });
  console.log(`Seeded ${quotes.length} quotes.`);
}

main().finally(() => prismaReuse.$disconnect());