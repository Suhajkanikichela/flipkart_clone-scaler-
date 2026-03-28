import type { ProductJson } from '@/types/product'

export function getProductName(title: ProductJson): string {
  const name = title.name
  if (typeof name === 'string' && name.trim() !== '') return name
  return 'Product'
}

export function getBrand(title: ProductJson): string | undefined {
  const b = title.brand
  return typeof b === 'string' ? b : undefined
}

export function getPriceParts(price: ProductJson): {
  mrp?: number
  selling?: number
  currency: string
} {
  const mrp = price.mrp
  const selling = price.selling
  const currency = price.currency
  return {
    mrp: typeof mrp === 'number' ? mrp : undefined,
    selling: typeof selling === 'number' ? selling : undefined,
    currency: typeof currency === 'string' ? currency : 'INR',
  }
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function specificationEntries(title: ProductJson): { key: string; value: string }[] {
  const skip = new Set(['name', 'brand'])
  const out: { key: string; value: string }[] = []
  for (const [key, val] of Object.entries(title)) {
    if (skip.has(key)) continue
    if (val === null || val === undefined) continue
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim()
    out.push({ key: label, value: String(val) })
  }
  return out
}
