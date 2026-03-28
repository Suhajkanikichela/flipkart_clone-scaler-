export function sellingUnitPrice(price: unknown): number {
  if (price && typeof price === "object") {
    const p = price as { selling?: unknown; mrp?: unknown };
    if (typeof p.selling === "number" && Number.isFinite(p.selling)) {
      return p.selling;
    }
    if (typeof p.mrp === "number" && Number.isFinite(p.mrp)) {
      return p.mrp;
    }
  }
  return 0;
}
