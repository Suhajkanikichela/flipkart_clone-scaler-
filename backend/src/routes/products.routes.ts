import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

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
    const raw = req.query.category;
    const category =
      typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;

    const products = await prisma.product.findMany({
      ...(category ? { where: { category } } : {}),
      orderBy: [{ category: "asc" }, { id: "asc" }],
    });

    res.json({ products, filter: { category: category ?? null } });
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

    res.json({ product });
  } catch (e) {
    next(e);
  }
});

export default router;
