/**
 * Thematic product images (Unsplash — free-to-use stock).
 * Each primary URL matches the catalog item; gallery pools add same-category variety.
 */

/** Unsplash CDN (stable photo ids — thematic stock). */
function us(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=80`;
}

/**
 * Main listing image per seeded product id (`{slug(category)}-{1..5}`).
 */
export const PRODUCT_PRIMARY_IMAGE_URL: Record<string, string> = {
  // Grocery — rice, oil, pulses, cookies, tea
  "grocery-1": us("photo-1586201375761-83865001e31c"),
  "grocery-2": us("photo-1474979266404-7eaacbcd87c5"),
  "grocery-3": us("photo-1515542622106-78bda8ba0e5b"),
  "grocery-4": us("photo-1558961363-fa8fdf82db35"),
  "grocery-5": us("photo-1564890369479-c89f75543c9f"),

  // Mobiles
  "mobiles-1": us("photo-1511707171634-5f897ff02aa9"),
  "mobiles-2": us("photo-1512499617640-c2f9991c2fb5"),
  "mobiles-3": us("photo-1592899677977-9c10ca588bbd"),
  "mobiles-4": us("photo-1592155931584-901bb59786a9"),
  "mobiles-5": us("photo-1616348436168-de43ad0db179"),

  // Fashion
  "fashion-1": us("photo-1542272604-787c3835535d"),
  "fashion-2": us("photo-1542291026-7eec264c27ff"),
  "fashion-3": us("photo-1595777457583-95e059d581b8"),
  "fashion-4": us("photo-1627123424574-724758594e93"),
  "fashion-5": us("photo-1434053941892-b622f97e1b29"),

  // Electronics
  "electronics-1": us("photo-1590658268037-6bf12165a8df"),
  "electronics-2": us("photo-1608043152269-423dbba4e7e1"),
  "electronics-3": us("photo-1579586337278-3befd40fd17a"),
  "electronics-4": us("photo-1625948515291-69613efd103f"),
  "electronics-5": us("photo-1587829741301-dc798b83add3"),

  // Home
  "home-1": us("photo-1631889993951-f1c34947599d"),
  "home-2": us("photo-1603199846144-e576d3b01cdd"),
  "home-3": us("photo-1507473885765-e6ed057f782c"),
  "home-4": us("photo-1584341076078-801f0765dbae"),
  "home-5": us("photo-1563861826100-9cb868fdbe1c"),

  // Appliances
  "appliances-1": us("photo-1621905252507-b35492cc74b4"),
  "appliances-2": us("photo-1626806819282-2c1dc01a5e0c"),
  "appliances-3": us("photo-1585659722983-3a675dabf23d"),
  "appliances-4": us("photo-1585515320310-259814833e62"),
  "appliances-5": us("photo-1556912173-46c336c7fd55"),

  // Travel
  "travel-1": us("photo-1565026057447-bc90a3dceb87"),
  "travel-2": us("photo-1553062407-98eeb64c6a62"),
  "travel-3": us("photo-1488646953014-85cb44e25828"),
  "travel-4": us("photo-1553531384-cc64ac80f931"),
  "travel-5": us("photo-1587825147138-346d228b435b"),

  // Beauty & Toys
  "beauty-toys-1": us("photo-1620916566398-39f1143ab7be"),
  "beauty-toys-2": us("photo-1586495777744-4413f21062fa"),
  "beauty-toys-3": us("photo-1587654780291-39c9404d746b"),
  "beauty-toys-4": us("photo-1610890719841-68230914f774"),
  "beauty-toys-5": us("photo-1594787318286-8139293e5b4f"),

  // Two Wheelers
  "two-wheelers-1": us("photo-1558618666-fcd25c85cd64"),
  "two-wheelers-2": us("photo-1558981806-ec527fa84c39"),
  "two-wheelers-3": us("photo-1608426057407-6952e8d29ab5"),
  "two-wheelers-4": us("photo-1618843479313-40f8afb4b4d8"),
  "two-wheelers-5": us("photo-1618680643036-a5063d05219b"),
};

/** Extra images per category for product detail carousel (thematic, not random). */
export const CATEGORY_GALLERY_URLS: Record<string, readonly string[]> = {
  Grocery: [
    us("photo-1506368083636-6defb67639a4"),
    us("photo-1464226184884-fa280b87c399"),
    us("photo-1497534449382-c45b5ede68e2"),
    us("photo-1542838132-92c53300491e"),
    us("photo-1606914469633-bd39206ea739"),
    us("photo-1481391315-0ea016976170"),
  ],
  Mobiles: [
    us("photo-1598327105666-5b89351aff97"),
    us("photo-1565849904461-04a58ad377e0"),
    us("photo-1523205771623-e0faa4d2813d"),
    us("photo-1580910051074-3eb694886505"),
    us("photo-1601784551446-20c9e07cdbdb"),
    us("photo-1574944985070-8f3ebc6b79d2"),
  ],
  Fashion: [
    us("photo-1445205170230-053b83016050"),
    us("photo-1434389677669-e08b4cac3105"),
    us("photo-1469334031218-e382a71b716b"),
    us("photo-1523381210434-271e8be1f52b"),
    us("photo-1548036328-c9fa89d128fa"),
    us("photo-1551028719-00167b16eac5"),
  ],
  Electronics: [
    us("photo-1545454675-3531b543be5d"),
    us("photo-1498049794561-7780e7231661"),
    us("photo-1519389950473-47ba0277781c"),
    us("photo-1593640408182-31b728feaeef"),
    us("photo-1588508065123-2b513c97e8ee"),
    us("photo-1527443224154-c4a39407d093"),
  ],
  Home: [
    us("photo-1586023492125-27b2c045efd7"),
    us("photo-1616486029423-aaa4789e8c9f"),
    us("photo-1615874959474-d609969a20ed"),
    us("photo-1618221195710-dd6b41faaea6"),
    us("photo-1556228453-efd6c1ff04f6"),
    us("photo-1615529328331-f8917593611a"),
  ],
  Appliances: [
    us("photo-1556911220-bff31c812dba"),
    us("photo-1571175443880-019e60d43a63"),
    us("photo-1556909114-f6e7ad7d3136"),
    us("photo-1585659722983-3a675dabf23d"),
    us("photo-1621905251918-48416bd8575a"),
    us("photo-1556912173-46c336c7fd55"),
  ],
  Travel: [
    us("photo-1488085063007-49e729b0a6ff"),
    us("photo-1553531384-cc64ac80f931"),
    us("photo-1566073771259-6a8506099945"),
    us("photo-1506012787146-f92b2956c437"),
    us("photo-1526772662000-3f88f10405ff"),
    us("photo-1488646953014-85cb44e25828"),
  ],
  "Beauty & Toys": [
    us("photo-1596462502278-27bfdc403348"),
    us("photo-1522335789203-aabd1fc54bc9"),
    us("photo-1566576721346-4da39caa4ace"),
    us("photo-1558618666-fcd25c85cd64"),
    us("photo-1556229010-6c3ed3f8f0b8"),
    us("photo-1610890719841-68230914f774"),
  ],
  "Two Wheelers": [
    us("photo-1568772585407-9361f9bf3a87"),
    us("photo-1449426468159-d96dbf08f19f"),
    us("photo-1622185135509-2152d023949e"),
    us("photo-1609630875171-b1321377ee65"),
    us("photo-1558981403-c5f9609c3ad8"),
    us("photo-1608426057407-6952e8d29ab5"),
  ],
};

export function primaryImageUrlForProductId(productId: string): string | undefined {
  return PRODUCT_PRIMARY_IMAGE_URL[productId];
}

export function galleryUrlsForProduct(product: {
  id: string;
  category: string;
}): string[] {
  const pool = CATEGORY_GALLERY_URLS[product.category];
  if (!pool?.length) return [];
  const match = product.id.match(/-(\d+)$/);
  const idx = match ? Math.max(0, parseInt(match[1], 10) - 1) : 0;
  return [0, 1, 2].map((j) => pool[(idx + j + 1) % pool.length]!);
}
