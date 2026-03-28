import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";

/** Must match `CategoryStrip` labels on the home page */
export const HOME_CATEGORIES = [
  "Grocery",
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home",
  "Appliances",
  "Travel",
  "Beauty & Toys",
  "Two Wheelers",
] as const;

type HomeCategory = (typeof HOME_CATEGORIES)[number];

function slug(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type SeedRow = {
  title: Prisma.InputJsonValue;
  price: Prisma.InputJsonValue;
  description: string;
  discount: string;
  tagline: string;
  quantity: number;
  stockCount: number;
};

/** Five sample products per category (titles/prices shaped like a typical Flipkart-style payload). */
const SEED_DATA: Record<HomeCategory, SeedRow[]> = {
  Grocery: [
    {
      title: { name: "Premium Basmati Rice", brand: "India Gate", unit: "5 kg" },
      price: { mrp: 499, selling: 399, currency: "INR" },
      description: "Long-grain aromatic basmati rice suitable for biryanis and daily meals.",
      discount: "20% off",
      tagline: "Staples best seller",
      quantity: 1,
      stockCount: 120,
    },
    {
      title: { name: "Sunflower Refined Oil", brand: "Fortune", unit: "5 L" },
      price: { mrp: 899, selling: 749, currency: "INR" },
      description: "Light edible oil for everyday cooking.",
      discount: "17% off",
      tagline: "Cook healthy",
      quantity: 1,
      stockCount: 85,
    },
    {
      title: { name: "Toor Dal", brand: "Tata Sampann", unit: "1 kg" },
      price: { mrp: 189, selling: 159, currency: "INR" },
      description: "Unpolished split pigeon peas.",
      discount: "16% off",
      tagline: "Protein rich",
      quantity: 1,
      stockCount: 200,
    },
    {
      title: { name: "Dark Fantasy Choco Fills", brand: "Sunfeast", unit: "300 g" },
      price: { mrp: 170, selling: 149, currency: "INR" },
      description: "Crunchy cookies with molten choco centre.",
      discount: "12% off",
      tagline: "Snack time",
      quantity: 1,
      stockCount: 60,
    },
    {
      title: { name: "Organic Green Tea", brand: "Tetley", unit: "100 g" },
      price: { mrp: 299, selling: 249, currency: "INR" },
      description: "Whole leaf green tea bags.",
      discount: "17% off",
      tagline: "Wellness pick",
      quantity: 1,
      stockCount: 44,
    },
  ],
  Mobiles: [
    {
      title: { name: "5G Smartphone", brand: "Nord", variant: "128GB" },
      price: { mrp: 27999, selling: 24999, currency: "INR" },
      description: "AMOLED display, 50MP camera, fast charging.",
      discount: "11% off",
      tagline: "Flagship killer",
      quantity: 1,
      stockCount: 35,
    },
    {
      title: { name: "Camera Phone", brand: "PixelSnap", variant: "256GB" },
      price: { mrp: 32999, selling: 29999, currency: "INR" },
      description: "Night mode and optical zoom for photography lovers.",
      discount: "9% off",
      tagline: "Photography first",
      quantity: 1,
      stockCount: 22,
    },
    {
      title: { name: "Budget 5G", brand: "LiteZ", variant: "64GB" },
      price: { mrp: 12999, selling: 10999, currency: "INR" },
      description: "HD+ display, large battery, stock Android.",
      discount: "15% off",
      tagline: "Value champion",
      quantity: 1,
      stockCount: 90,
    },
    {
      title: { name: "Gaming Phone", brand: "Thunder", variant: "512GB" },
      price: { mrp: 45999, selling: 42999, currency: "INR" },
      description: "120Hz panel, vapor cooling, stereo speakers.",
      discount: "7% off",
      tagline: "Esports ready",
      quantity: 1,
      stockCount: 15,
    },
    {
      title: { name: "Foldable", brand: "Flex", variant: "256GB" },
      price: { mrp: 89999, selling: 84999, currency: "INR" },
      description: "Compact fold design with flagship internals.",
      discount: "6% off",
      tagline: "Innovation",
      quantity: 1,
      stockCount: 8,
    },
  ],
  Fashion: [
    {
      title: { name: "Slim Fit Jeans", brand: "UrbanRoam", fit: "32" },
      price: { mrp: 1999, selling: 999, currency: "INR" },
      description: "Stretch denim with tapered leg.",
      discount: "50% off",
      tagline: "Street style",
      quantity: 1,
      stockCount: 70,
    },
    {
      title: { name: "Running Shoes", brand: "Stride", size: "UK 9" },
      price: { mrp: 4999, selling: 3499, currency: "INR" },
      description: "Breathable mesh with cushioned midsole.",
      discount: "30% off",
      tagline: "Daily runs",
      quantity: 1,
      stockCount: 55,
    },
    {
      title: { name: "Cotton Kurta Set", brand: "Ethno", size: "M" },
      price: { mrp: 1499, selling: 899, currency: "INR" },
      description: "Handloom-inspired print, comfortable fit.",
      discount: "40% off",
      tagline: "Festive wear",
      quantity: 1,
      stockCount: 40,
    },
    {
      title: { name: "Leather Wallet", brand: "Vault", color: "Brown" },
      price: { mrp: 899, selling: 599, currency: "INR" },
      description: "RFID blocking bifold wallet.",
      discount: "33% off",
      tagline: "Classic",
      quantity: 1,
      stockCount: 100,
    },
    {
      title: { name: "Sports Watch", brand: "Pulse", color: "Black" },
      price: { mrp: 3999, selling: 2799, currency: "INR" },
      description: "Heart rate, SpO2, and 100+ sport modes.",
      discount: "30% off",
      tagline: "Fitness",
      quantity: 1,
      stockCount: 33,
    },
  ],
  Electronics: [
    {
      title: { name: "Wireless Earbuds", brand: "SoundAir", model: "Pro 2" },
      price: { mrp: 7999, selling: 5499, currency: "INR" },
      description: "ANC, 36h case battery, low latency gaming mode.",
      discount: "31% off",
      tagline: "Audio deal",
      quantity: 1,
      stockCount: 150,
    },
    {
      title: { name: "Bluetooth Speaker", brand: "BoomBox", model: "Mini" },
      price: { mrp: 3499, selling: 2499, currency: "INR" },
      description: "IPX7 waterproof, 12h playback.",
      discount: "29% off",
      tagline: "Party ready",
      quantity: 1,
      stockCount: 88,
    },
    {
      title: { name: "Smartwatch", brand: "FitRing", model: "S4" },
      price: { mrp: 9999, selling: 6999, currency: "INR" },
      description: "AMOLED, GPS, Bluetooth calling.",
      discount: "30% off",
      tagline: "Wearables",
      quantity: 1,
      stockCount: 62,
    },
    {
      title: { name: "USB-C Hub", brand: "LinkPort", ports: "7-in-1" },
      price: { mrp: 2499, selling: 1799, currency: "INR" },
      description: "HDMI 4K, SD card reader, PD pass-through.",
      discount: "28% off",
      tagline: "Work from home",
      quantity: 1,
      stockCount: 200,
    },
    {
      title: { name: "Mechanical Keyboard", brand: "KeyForge", switch: "Blue" },
      price: { mrp: 5999, selling: 4499, currency: "INR" },
      description: "Hot-swappable switches, RGB backlight.",
      discount: "25% off",
      tagline: "Gamers choice",
      quantity: 1,
      stockCount: 41,
    },
  ],
  Home: [
    {
      title: { name: "Bedsheet Set", brand: "CozyHome", size: "King" },
      price: { mrp: 2499, selling: 1299, currency: "INR" },
      description: "Cotton blend, includes 2 pillow covers.",
      discount: "48% off",
      tagline: "Bedroom",
      quantity: 1,
      stockCount: 75,
    },
    {
      title: { name: "Ceramic Dinner Set", brand: "DineArt", pieces: "16" },
      price: { mrp: 3999, selling: 2499, currency: "INR" },
      description: "Microwave-safe plates and bowls.",
      discount: "38% off",
      tagline: "Dining",
      quantity: 1,
      stockCount: 30,
    },
    {
      title: { name: "LED Table Lamp", brand: "Luma", watt: "9W" },
      price: { mrp: 1299, selling: 799, currency: "INR" },
      description: "Warm white, touch dimmer, metal body.",
      discount: "39% off",
      tagline: "Study corner",
      quantity: 1,
      stockCount: 110,
    },
    {
      title: { name: "Storage Containers", brand: "TidyMax", pack: "6 pcs" },
      price: { mrp: 899, selling: 499, currency: "INR" },
      description: "BPA-free modular kitchen jars.",
      discount: "44% off",
      tagline: "Organize",
      quantity: 1,
      stockCount: 140,
    },
    {
      title: { name: "Wall Clock", brand: "TickTock", diameter: "12 inch" },
      price: { mrp: 1499, selling: 899, currency: "INR" },
      description: "Silent sweep movement, glass front.",
      discount: "40% off",
      tagline: "Living room",
      quantity: 1,
      stockCount: 50,
    },
  ],
  Appliances: [
    {
      title: { name: "Split AC", brand: "CoolBreeze", capacity: "1.5 Ton" },
      price: { mrp: 42999, selling: 34999, currency: "INR" },
      description: "5-star inverter, copper condenser.",
      discount: "19% off",
      tagline: "Summer sale",
      quantity: 1,
      stockCount: 18,
    },
    {
      title: { name: "Front Load Washer", brand: "WashPro", load: "7 kg" },
      price: { mrp: 32999, selling: 27999, currency: "INR" },
      description: "Steam wash, inverter motor, 1200 RPM.",
      discount: "15% off",
      tagline: "Laundry",
      quantity: 1,
      stockCount: 12,
    },
    {
      title: { name: "Microwave Oven", brand: "HeatWave", capacity: "28 L" },
      price: { mrp: 14999, selling: 11999, currency: "INR" },
      description: "Convection with starter kit.",
      discount: "20% off",
      tagline: "Kitchen",
      quantity: 1,
      stockCount: 25,
    },
    {
      title: { name: "Air Fryer", brand: "CrispAir", capacity: "5.5 L" },
      price: { mrp: 9999, selling: 6999, currency: "INR" },
      description: "Digital touchscreen, 8 presets.",
      discount: "30% off",
      tagline: "Healthy fry",
      quantity: 1,
      stockCount: 40,
    },
    {
      title: { name: "Chimney", brand: "SmokeOut", suction: "1200 m³/h" },
      price: { mrp: 18999, selling: 14999, currency: "INR" },
      description: "Auto-clean, touch panel, LED lamps.",
      discount: "21% off",
      tagline: "Modular kitchen",
      quantity: 1,
      stockCount: 10,
    },
  ],
  Travel: [
    {
      title: { name: "Hardshell Trolley", brand: "SkyRoll", size: "Medium" },
      price: { mrp: 7999, selling: 4999, currency: "INR" },
      description: "Polycarbonate shell, TSA lock, 360° wheels.",
      discount: "38% off",
      tagline: "Check-in",
      quantity: 1,
      stockCount: 45,
    },
    {
      title: { name: "Travel Backpack", brand: "TrailPack", volume: "40 L" },
      price: { mrp: 3499, selling: 2299, currency: "INR" },
      description: "Laptop compartment, rain cover included.",
      discount: "34% off",
      tagline: "Weekend trips",
      quantity: 1,
      stockCount: 60,
    },
    {
      title: { name: "Neck Pillow", brand: "CloudRest", material: "Memory foam" },
      price: { mrp: 899, selling: 499, currency: "INR" },
      description: "Ergonomic support for flights and buses.",
      discount: "44% off",
      tagline: "Comfort",
      quantity: 1,
      stockCount: 200,
    },
    {
      title: { name: "Packing Cubes", brand: "CubeIt", pack: "Set of 6" },
      price: { mrp: 1299, selling: 799, currency: "INR" },
      description: "Lightweight mesh organizers.",
      discount: "39% off",
      tagline: "Organized pack",
      quantity: 1,
      stockCount: 95,
    },
    {
      title: { name: "Universal Adapter", brand: "PlugWorld", regions: "150+" },
      price: { mrp: 1999, selling: 1299, currency: "INR" },
      description: "Type-C PD, surge protection.",
      discount: "35% off",
      tagline: "Global travel",
      quantity: 1,
      stockCount: 130,
    },
  ],
  "Beauty & Toys": [
    {
      title: { name: "Vitamin C Serum", brand: "GlowLab", volume: "30 ml" },
      price: { mrp: 899, selling: 599, currency: "INR" },
      description: "Brightening serum with hyaluronic acid.",
      discount: "33% off",
      tagline: "Skincare",
      quantity: 1,
      stockCount: 180,
    },
    {
      title: { name: "Matte Lipstick", brand: "Velvet", shade: "Ruby" },
      price: { mrp: 599, selling: 399, currency: "INR" },
      description: "Long-wear formula, enriched with shea butter.",
      discount: "33% off",
      tagline: "Makeup",
      quantity: 1,
      stockCount: 220,
    },
    {
      title: { name: "Building Blocks", brand: "BrickKid", pieces: "250" },
      price: { mrp: 1499, selling: 999, currency: "INR" },
      description: "STEM-friendly creative construction set.",
      discount: "33% off",
      tagline: "Toys",
      quantity: 1,
      stockCount: 55,
    },
    {
      title: { name: "Board Game", brand: "FunQuest", players: "2-6" },
      price: { mrp: 1999, selling: 1299, currency: "INR" },
      description: "Strategy game with quick setup.",
      discount: "35% off",
      tagline: "Family night",
      quantity: 1,
      stockCount: 40,
    },
    {
      title: { name: "RC Car", brand: "TurboToy", scale: "1:16" },
      price: { mrp: 2999, selling: 1999, currency: "INR" },
      description: "2.4 GHz remote, rechargeable battery.",
      discount: "33% off",
      tagline: "Kids favorite",
      quantity: 1,
      stockCount: 28,
    },
  ],
  "Two Wheelers": [
    {
      title: { name: "Commuter Scooter", brand: "ZipGo", engine: "125cc" },
      price: { mrp: 89999, selling: 82999, currency: "INR" },
      description: "Fuel efficient, LED headlamp, digital cluster.",
      discount: "8% off",
      tagline: "City ride",
      quantity: 1,
      stockCount: 8,
    },
    {
      title: { name: "Street Bike", brand: "ThunderLine", engine: "155cc" },
      price: { mrp: 145999, selling: 134999, currency: "INR" },
      description: "ABS, slipper clutch, sporty ergonomics.",
      discount: "8% off",
      tagline: "Performance",
      quantity: 1,
      stockCount: 5,
    },
    {
      title: { name: "Electric Scooter", brand: "VoltAir", range: "100 km" },
      price: { mrp: 109999, selling: 99999, currency: "INR" },
      description: "Fast charging, connected app features.",
      discount: "9% off",
      tagline: "EV future",
      quantity: 1,
      stockCount: 12,
    },
    {
      title: { name: "Helmet", brand: "SafeRide", certification: "ISI" },
      price: { mrp: 2499, selling: 1799, currency: "INR" },
      description: "Dual visor, high-impact shell.",
      discount: "28% off",
      tagline: "Safety first",
      quantity: 1,
      stockCount: 90,
    },
    {
      title: { name: "Riding Gloves", brand: "GripMax", size: "L" },
      price: { mrp: 1299, selling: 899, currency: "INR" },
      description: "Knuckle protection, touchscreen fingers.",
      discount: "31% off",
      tagline: "Gear",
      quantity: 1,
      stockCount: 70,
    },
  ],
};

function buildProductId(category: HomeCategory, index: number): string {
  return `${slug(category)}-${index + 1}`;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg(databaseUrl);
  const prisma = new PrismaClient({ adapter });

  for (const category of HOME_CATEGORIES) {
    const rows = SEED_DATA[category];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const id = buildProductId(category, i);
      const url = `https://picsum.photos/seed/${encodeURIComponent(id)}/512/512`;
      const detailUrl = `/products/${id}`;

      await prisma.product.upsert({
        where: { id },
        create: {
          id,
          category,
          url,
          detailUrl,
          title: row.title,
          price: row.price,
          quantity: row.quantity,
          stockCount: row.stockCount,
          description: row.description,
          discount: row.discount,
          tagline: row.tagline,
        },
        update: {
          category,
          url,
          detailUrl,
          title: row.title,
          price: row.price,
          quantity: row.quantity,
          stockCount: row.stockCount,
          description: row.description,
          discount: row.discount,
          tagline: row.tagline,
        },
      });
    }
  }

  const total = await prisma.product.count();
  console.log(`Seed complete: ${total} products (${HOME_CATEGORIES.length} categories × 5).`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
