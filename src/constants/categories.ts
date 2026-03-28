export const HOME_CATEGORIES = [
  { label: 'Grocery', emoji: '🛒' },
  { label: 'Mobiles', emoji: '📱' },
  { label: 'Fashion', emoji: '👕' },
  { label: 'Electronics', emoji: '🎧' },
  { label: 'Home', emoji: '🛋️' },
  { label: 'Appliances', emoji: '❄️' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Beauty & Toys', emoji: '💄' },
  { label: 'Two Wheelers', emoji: '🏍️' },
] as const

export type HomeCategoryLabel = (typeof HOME_CATEGORIES)[number]['label']
