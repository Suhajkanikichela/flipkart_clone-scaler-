export type ProductJson = Record<string, unknown>

export type Product = {
  id: string
  category: string
  url: string
  detailUrl: string
  title: ProductJson
  price: ProductJson
  quantity: number
  stockCount: number
  description: string
  discount: string
  tagline: string
}
