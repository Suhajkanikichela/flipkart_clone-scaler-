import { getApiBaseUrl } from '@/lib/api'
import type { Product } from '@/types/product'

const base = () => `${getApiBaseUrl()}/products`

export async function fetchProducts(category?: string): Promise<{
  products: Product[]
  filter: { category: string | null }
}> {
  const url = new URL(base())
  if (category) {
    url.searchParams.set('category', category)
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`)
  }
  return res.json() as Promise<{
    products: Product[]
    filter: { category: string | null }
  }>
}

export type CategorySummary = { name: string; productCount: number }

export async function fetchCategories(): Promise<{ categories: CategorySummary[] }> {
  const res = await fetch(`${base()}/categories`)
  if (!res.ok) {
    throw new Error(`Failed to load categories (${res.status})`)
  }
  return res.json() as Promise<{ categories: CategorySummary[] }>
}

export async function fetchProductById(id: string): Promise<{ product: Product }> {
  const res = await fetch(`${base()}/${encodeURIComponent(id)}`)
  if (res.status === 404) {
    throw new Error('NOT_FOUND')
  }
  if (!res.ok) {
    throw new Error(`Failed to load product (${res.status})`)
  }
  return res.json() as Promise<{ product: Product }>
}
