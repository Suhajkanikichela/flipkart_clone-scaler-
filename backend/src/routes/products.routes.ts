import type { RequestHandler } from "express";
import { Router } from "express";
import { prisma } from "../lib/prisma";
import {
  productNameIncludesSearch,
  toProductDto,
  toProductDtoList,
} from "../lib/productPresenter";

const router = Router();

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j]!;
    a[j] = t!;
  }
  return a;
}

/** Mount with `app.get("/products/random", randomProductsHandler)` before `app.use("/products", router)`. */
export const randomProductsHandler: RequestHandler = async (req, res, next) => {
  try {
    const raw = req.query.limit;
    const parsed = raw === undefined ? 6 : Number(raw);
    const limit =
      Number.isFinite(parsed) && parsed > 0 ? Math.min(50, Math.floor(parsed)) : 6;

    const all = await prisma.product.findMany();
    const products = shuffle(all).slice(0, Math.min(limit, all.length));

    res.json({ products: toProductDtoList(products) });
  } catch (e) {
    next(e);
  }
};

/** Mount with `app.get("/products/shuffled", shuffledProductsHandler)` before `app.use("/products", router)`. */
export const shuffledProductsHandler: RequestHandler = async (_req, res, next) => {
  try {
    const all = await prisma.product.findMany();
    res.json({ products: toProductDtoList(shuffle(all)) });
  } catch (e) {
    next(e);
  }
};

router.get("/categories", async (_req, res, next) => {
  try {
    const grouped = await prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { category: "asc" },
    });

    const categories = grouped.map((row) => ({
      name: row.category,
      productCount: row._count.id,
    }));

    res.json({ categories });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const q = req.query;
    // Path `/products/random` can be eaten by `/:id` on some Express setups; query flags always hit this route.
    if (q.random === "1" || q.random === "true") {
      await randomProductsHandler(req, res, next);
      return;
    }
    if (q.shuffled === "1" || q.shuffled === "true") {
      await shuffledProductsHandler(req, res, next);
      return;
    }

    const raw = q.category;
    const category =
      typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;

    const searchRaw = typeof q.q === "string" ? q.q.trim() : "";
    const searchLower = searchRaw.toLowerCase();

    let products = await prisma.product.findMany({
      ...(category ? { where: { category } } : {}),
      orderBy: [{ category: "asc" }, { id: "asc" }],
    });

    if (searchLower) {
      products = products.filter((p) =>
        productNameIncludesSearch(p, searchLower),
      );
    }

    res.json({
      products: toProductDtoList(products),
      filter: { category: category ?? null, search: searchRaw || null },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || id === "categories") {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ product: toProductDto(product) });
  } catch (e) {
    next(e);
  }
});

export default router;
