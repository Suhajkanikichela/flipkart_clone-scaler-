import type { Product } from "../generated/prisma/client";

export type ProductDto = Product & { images: string[] };

export function toProductDto(product: Product): ProductDto {
  const images = [
    product.url,
    ...[1, 2, 3].map(
      (i) =>
        `https://picsum.photos/seed/${encodeURIComponent(`${product.id}-g${i}`)}/800/800`,
    ),
  ];
  return { ...product, images };
}

export function toProductDtoList(products: Product[]): ProductDto[] {
  return products.map(toProductDto);
}

/** Reads `title.name` from Prisma JSON (object or stringified JSON). */
export function getTitleName(product: Product): string {
  const title = product.title;
  if (title == null) return "";
  if (typeof title === "string") {
    try {
      const p = JSON.parse(title) as { name?: unknown };
      return typeof p.name === "string" ? p.name : "";
    } catch {
      return "";
    }
  }
  if (typeof title === "object" && "name" in title) {
    const n = (title as { name?: unknown }).name;
    return typeof n === "string" ? n : "";
  }
  return "";
}

/** Match search only against the product display name (`title.name`), case-insensitive substring. */
export function productNameIncludesSearch(
  product: Product,
  searchLower: string,
): boolean {
  if (!searchLower) return true;
  const name = getTitleName(product).toLowerCase();
  return name.includes(searchLower);
}
