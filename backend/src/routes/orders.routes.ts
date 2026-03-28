import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sellingUnitPrice } from "../lib/price";
import { getGuestUserId } from "../lib/guestUser";
import { toProductDto } from "../lib/productPresenter";

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

type ShippingBody = {
  fullName?: unknown;
  phone?: unknown;
  line1?: unknown;
  line2?: unknown;
  city?: unknown;
  state?: unknown;
  pincode?: unknown;
};

function validateShipping(s: ShippingBody): string | null {
  const fullName = typeof s.fullName === "string" ? s.fullName.trim() : "";
  const phone = typeof s.phone === "string" ? s.phone.trim() : "";
  const line1 = typeof s.line1 === "string" ? s.line1.trim() : "";
  const city = typeof s.city === "string" ? s.city.trim() : "";
  const state = typeof s.state === "string" ? s.state.trim() : "";
  const pincode = typeof s.pincode === "string" ? s.pincode.trim() : "";
  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    return "All shipping fields except address line 2 are required";
  }
  if (!/^\d{6}$/.test(pincode)) {
    return "Pincode must be 6 digits";
  }
  return null;
}

router.post("/", async (req, res, next) => {
  try {
    const rawItems = req.body?.items;
    const shipping = req.body?.shipping as ShippingBody | undefined;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      res.status(400).json({ error: "items must be a non-empty array" });
      return;
    }
    if (!shipping || typeof shipping !== "object") {
      res.status(400).json({ error: "shipping object required" });
      return;
    }

    const shipErr = validateShipping(shipping);
    if (shipErr) {
      res.status(400).json({ error: shipErr });
      return;
    }

    const parsed: { productId: string; quantity: number }[] = [];
    for (const row of rawItems as LineInput[]) {
      const productId =
        typeof row.productId === "string" ? row.productId.trim() : "";
      const qty = Number(row.quantity);
      if (!productId || !Number.isInteger(qty) || qty < 1) {
        res.status(400).json({ error: "Invalid cart line" });
        return;
      }
      parsed.push({ productId, quantity: qty });
    }

    const lines = mergeLines(parsed);

    const userId = await getGuestUserId();
    const ids = [...new Set(lines.map((l) => l.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const orderLines: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    for (const line of lines) {
      const p = byId.get(line.productId);
      if (!p) {
        res.status(400).json({ error: `Unknown product: ${line.productId}` });
        return;
      }
      if (line.quantity > p.stockCount) {
        res.status(400).json({
          error: `Insufficient stock for ${line.productId}`,
          available: p.stockCount,
        });
        return;
      }
      const unitPrice = sellingUnitPrice(p.price);
      totalAmount += unitPrice * line.quantity;
      orderLines.push({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice,
      });
    }

    const line2 =
      typeof shipping.line2 === "string" ? shipping.line2.trim() : "";

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "CONFIRMED",
          shippingFullName: String(shipping.fullName).trim(),
          shippingPhone: String(shipping.phone).trim(),
          shippingLine1: String(shipping.line1).trim(),
          shippingLine2: line2 || null,
          shippingCity: String(shipping.city).trim(),
          shippingState: String(shipping.state).trim(),
          shippingPincode: String(shipping.pincode).trim(),
        },
      });

      for (const ol of orderLines) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: ol.productId,
            quantity: ol.quantity,
            unitPrice: ol.unitPrice,
          },
        });
        await tx.product.update({
          where: { id: ol.productId },
          data: { stockCount: { decrement: ol.quantity } },
        });
      }

      return created;
    });

    const full = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    res.status(201).json({
      order: full
        ? {
            id: full.id,
            totalAmount: full.totalAmount,
            status: full.status,
            createdAt: full.createdAt,
            shipping: {
              fullName: full.shippingFullName,
              phone: full.shippingPhone,
              line1: full.shippingLine1,
              line2: full.shippingLine2,
              city: full.shippingCity,
              state: full.shippingState,
              pincode: full.shippingPincode,
            },
            items: full.orderItems.map((oi) => ({
              id: oi.id,
              quantity: oi.quantity,
              unitPrice: oi.unitPrice,
              lineTotal: oi.quantity * oi.unitPrice,
              product: toProductDto(oi.product),
            })),
          }
        : order,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        shipping: {
          fullName: order.shippingFullName,
          phone: order.shippingPhone,
          line1: order.shippingLine1,
          line2: order.shippingLine2,
          city: order.shippingCity,
          state: order.shippingState,
          pincode: order.shippingPincode,
        },
        items: order.orderItems.map((oi) => ({
          id: oi.id,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          lineTotal: oi.quantity * oi.unitPrice,
          product: toProductDto(oi.product),
        })),
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
