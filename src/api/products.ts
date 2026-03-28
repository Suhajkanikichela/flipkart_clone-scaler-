import { getApiBaseUrl } from '@/lib/api'
import type { Product } from '@/types/product'

const base = () => `${getApiBaseUrl()}/products`

export async function fetchProducts(
  category?: string,
  search?: string,
): Promise<{
  products: Product[]
  filter: { category: string | null; search: string | null }
}> {
  const url = new URL(base())
  if (category) {
    url.searchParams.set('category', category)
  }
  if (search && search.trim() !== '') {
    url.searchParams.set('q', search.trim())
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`)
  }
  return res.json() as Promise<{
    products: Product[]
    filter: { category: string | null; search: string | null }
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

export async function fetchRandomProducts(limit = 6): Promise<{ products: Product[] }> {
  const url = new URL(base())
  url.searchParams.set('random', '1')
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Failed to load deals (${res.status})`)
  }
  return res.json() as Promise<{ products: Product[] }>
}

export async function fetchShuffledProducts(): Promise<{ products: Product[] }> {
  const url = new URL(base())
  url.searchParams.set('shuffled', '1')
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`)
  }
  return res.json() as Promise<{ products: Product[] }>
}
