/**
 * Updates only `Product.url` (main image) from `productImageUrls.ts`.
 * Run after deploy or when URLs change: `npm run db:update-images` from `backend/`.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PRODUCT_PRIMARY_IMAGE_URL } from "./productImageUrls";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg(databaseUrl);
  const prisma = new PrismaClient({ adapter });

  let updated = 0;
  for (const [id, url] of Object.entries(PRODUCT_PRIMARY_IMAGE_URL)) {
    const result = await prisma.product.updateMany({
      where: { id },
      data: { url },
    });
    updated += result.count;
  }

  console.log(
    `Image URL update: ${updated} row(s) matched (expected ${Object.keys(PRODUCT_PRIMARY_IMAGE_URL).length}).`,
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
