import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sellingUnitPrice } from "../lib/price";
import { type ProductDto, toProductDto } from "../lib/productPresenter";

const router = Router();

type LineInput = { productId?: unknown; quantity?: unknown };

function mergeLines(
  lines: { productId: string; quantity: number }[],
): { productId: string; quantity: number }[] {
  const m = new Map<string, number>();
  for (const l of lines) {
    m.set(l.productId, (m.get(l.productId) ?? 0) + l.quantity);
  }
  return [...m.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

router.post("/preview", async (req, res, next) => {
  try {
    const raw = req.body?.items;
    if (!Array.isArray(raw) || raw.length === 0) {
      res.status(400).json({ error: "items must be a non-empty array" });
      return;
    }

    const parsed: { productId: string; quantity: number }[] = [];
    for (const row of raw as LineInput[]) {
      const productId =
        typeof row.productId === "string" ? row.productId.trim() : "";
      const qty = Number(row.quantity);
      if (!productId || !Number.isInteger(qty) || qty < 1) {
        res.status(400).json({
          error: "Each item needs productId and quantity ≥ 1",
        });
        return;
      }
      parsed.push({ productId, quantity: qty });
    }

    const lines = mergeLines(parsed);

    const ids = [...new Set(lines.map((l) => l.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    const items: {
      product: ProductDto;
      quantity: number;
      requestedQuantity: number;
      unitPrice: number;
      lineTotal: number;
      stockCount: number;
    }[] = [];

    const removed: string[] = [];

    let subtotal = 0;
    for (const line of lines) {
      const p = byId.get(line.productId);
      if (!p) {
        removed.push(line.productId);
        continue;
      }

      const effectiveQty = Math.min(line.quantity, Math.max(0, p.stockCount));
      if (effectiveQty < 1) {
        removed.push(line.productId);
        continue;
      }

      const unitPrice = sellingUnitPrice(p.price);
      const lineTotal = unitPrice * effectiveQty;
      subtotal += lineTotal;
      items.push({
        product: toProductDto(p),
        quantity: effectiveQty,
        requestedQuantity: line.quantity,
        unitPrice,
        lineTotal,
        stockCount: p.stockCount,
      });
    }

    const itemCount = items.reduce((s, l) => s + l.quantity, 0);
    res.json({
      items,
      subtotal,
      total: subtotal,
      itemCount,
      removed,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
