import "../src/configs/configs.ts";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * =========================================================
 * CONFIG
 * =========================================================
 */

const START_DATE = new Date("2026-05-01T00:00:00.000Z");
const END_DATE = new Date("2026-09-20T23:59:59.999Z");

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Deterministic random generator.
 * Same seed = similar data every time.
 */
let randomSeed = 20260920;

function random() {
  randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;

  return randomSeed / 4294967296;
}

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return random() * (max - min) + min;
}

function randomBoolean(probability = 0.5) {
  return random() < probability;
}

function randomPick<T>(array: T[]): T {
  const value = array[randomInt(0, array.length - 1)];

  if (value === undefined) {
    throw new Error("Cannot pick from an empty array");
  }

  return value;
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + random() * (end.getTime() - start.getTime()),
  );
}

function daysAgo(days: number) {
  return new Date(END_DATE.getTime() - days * DAY_MS);
}

function decimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

/**
 * =========================================================
 * TYPES
 * =========================================================
 */

type UserData = {
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
};

type ProductData = {
  productId: number;
  name: string;
  price: Prisma.Decimal;
};

type AddressData = {
  id: number;
  userId: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

/**
 * =========================================================
 * MAIN
 * =========================================================
 */

async function main() {
  console.log("");
  console.log("🌸 Starting Komorebi seed...");
  console.log("==================================================");

  /**
   * =======================================================
   * 1. CLEAN DATABASE
   * =======================================================
   */

  console.log("");
  console.log("🧹 Cleaning database...");

  await prisma.refreshToken.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Database cleaned");

  /**
   * =======================================================
   * 2. PASSWORD
   * =======================================================
   */

  const passwordHash = await bcrypt.hash("Password123!", 10);

  /**
   * =======================================================
   * 3. USERS
   * =======================================================
   */

  console.log("");
  console.log("👤 Creating users...");

  /**
   * ADMIN USERS
   */

  await prisma.user.create({
    data: {
      userId: "admin_001",
      name: "Eric Admin",
      email: "admin@komorebi.com",
      passwordHash,
      role: "ADMIN",
      phoneNumber: "+60123456789",
      isActive: true,
      createdAt: new Date("2026-05-01T09:00:00.000Z"),
    },
  });

  await prisma.user.create({
    data: {
      userId: "admin_002",
      name: "Komorebi Manager",
      email: "manager@komorebi.com",
      passwordHash,
      role: "ADMIN",
      phoneNumber: "+60129876543",
      isActive: true,
      createdAt: new Date("2026-05-02T09:00:00.000Z"),
    },
  });

  /**
   * CUSTOMER NAMES
   */

  const customerNames = [
    "Alice Tan",
    "Jason Lim",
    "Sarah Wong",
    "Daniel Lee",
    "Emily Ng",
    "Kevin Tan",
    "Michelle Lim",
    "Ryan Wong",
    "Sophia Lee",
    "Lucas Tan",
    "Chloe Lim",
    "Ethan Wong",
    "Olivia Lee",
    "Nathan Tan",
    "Emma Wong",
    "Benjamin Lee",
    "Ava Tan",
    "Noah Lim",
    "Grace Wong",
    "William Lee",
    "Mia Tan",
    "James Lim",
    "Ella Wong",
    "Alexander Lee",
    "Amelia Tan",
    "Henry Lim",
    "Charlotte Wong",
    "Leo Lee",
    "Isabella Tan",
    "Matthew Lim",
    "Harper Wong",
    "Lucas Lee",
    "Evelyn Tan",
    "Daniel Lim",
    "Lily Wong",
    "Michael Lee",
    "Sophie Tan",
    "Samuel Lim",
    "Zoe Wong",
    "Jack Lee",
    "Hannah Tan",
    "Oliver Lim",
    "Scarlett Wong",
    "Jacob Lee",
    "Aria Tan",
    "Thomas Lim",
    "Layla Wong",
    "George Lee",
    "Nora Tan",
    "Charlie Lim",
    "Victoria Wong",
    "Edward Lee",
    "Ella Tan",
    "Dylan Lim",
    "Lucy Wong",
    "Sebastian Lee",
    "Ruby Tan",
    "Joshua Lim",
    "Ivy Wong",
    "Daniel Wong",
  ];

  const customers: UserData[] = [];

  for (let index = 0; index < customerNames.length; index++) {
    const name = customerNames[index];

    if (!name) {
      throw new Error(`Missing customer name at index ${index}`);
    }

    const email = `customer${String(index + 1).padStart(3, "0")}@example.com`;

    /**
     * Customers are created throughout
     * the five-month period.
     */
    const createdAt = randomDate(
      START_DATE,
      new Date("2026-09-15T23:59:59.999Z"),
    );

    const user = await prisma.user.create({
      data: {
        userId: `customer_${String(index + 1).padStart(3, "0")}`,

        name,

        email,

        passwordHash,

        role: "USER",

        phoneNumber: `+601${randomInt(10000000, 99999999)}`,

        isActive: randomBoolean(0.95),

        createdAt,
      },
    });

    customers.push({
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  console.log(`✓ Created 2 admins + ${customers.length} customers`);

  /**
   * =======================================================
   * 4. CATEGORIES
   * =======================================================
   */

  console.log("");
  console.log("📂 Creating categories...");

  const categoryNames = [
    "Luxury Plush",
    "Stationery Stories",
    "Designer Trinkets",
    "Atelier Gift Sets",
    "Japanese Lifestyle",
    "Seasonal Collection",
  ];

  const categories = [];

  for (let index = 0; index < categoryNames.length; index++) {
    const category = await prisma.category.create({
      data: {
        name: categoryNames[index]!,

        isActive: true,

        createdAt: randomDate(START_DATE, new Date("2026-05-10T23:59:59.999Z")),
      },
    });

    categories.push(category);
  }

  const categoryMap = new Map<string, number>();

  for (const category of categories) {
    categoryMap.set(category.name, category.categoryId);
  }

  console.log(`✓ Created ${categories.length} categories`);

  /**
   * =======================================================
   * 5. PRODUCTS
   * =======================================================
   */

  console.log("");
  console.log("🛍️ Creating products...");

  const productDefinitions = [
    // Luxury Plush
    {
      name: "Mochi Bunny Plush",
      category: "Luxury Plush",
      price: 89.9,
      description:
        "A soft Japanese-inspired bunny plush with a gentle mochi-like texture.",
    },
    {
      name: "Sakura Bear Plush",
      category: "Luxury Plush",
      price: 109.9,
      description:
        "A premium bear plush inspired by Tokyo spring and cherry blossoms.",
    },
    {
      name: "Cloud Cat Plush",
      category: "Luxury Plush",
      price: 99.9,
      description:
        "A fluffy cloud-inspired cat plush designed for cozy spaces.",
    },
    {
      name: "Matcha Panda Plush",
      category: "Luxury Plush",
      price: 94.9,
      description:
        "An adorable panda plush featuring a soft matcha-inspired palette.",
    },
    {
      name: "Little Fox Plush",
      category: "Luxury Plush",
      price: 84.9,
      description:
        "A warm and playful fox plush with a handcrafted boutique feel.",
    },
    {
      name: "Strawberry Milk Bunny",
      category: "Luxury Plush",
      price: 92.9,
      description: "A cute strawberry milk themed bunny plush.",
    },
    {
      name: "Sleepy Neko Plush",
      category: "Luxury Plush",
      price: 104.9,
      description: "A sleepy Japanese cat plush made for cozy rooms.",
    },
    {
      name: "Cream Bear Plush",
      category: "Luxury Plush",
      price: 99.9,
      description: "A soft cream-colored bear plush with premium fabric.",
    },
    {
      name: "Mochi Hamster Plush",
      category: "Luxury Plush",
      price: 79.9,
      description: "A tiny hamster plush with a soft round design.",
    },

    // Stationery
    {
      name: "Tokyo Morning Notebook",
      category: "Stationery Stories",
      price: 29.9,
      description:
        "Minimal Japanese-inspired notebook for notes, sketches and daily thoughts.",
    },
    {
      name: "Sakura Memo Pad",
      category: "Stationery Stories",
      price: 18.9,
      description:
        "A compact memo pad decorated with delicate cherry blossom illustrations.",
    },
    {
      name: "Kawaii Sticker Collection",
      category: "Stationery Stories",
      price: 15.9,
      description:
        "A curated sticker set featuring playful Japanese-inspired characters.",
    },
    {
      name: "Pastel Washi Tape Set",
      category: "Stationery Stories",
      price: 22.9,
      description:
        "A set of soft pastel washi tapes for journals and creative projects.",
    },
    {
      name: "Midnight Letter Set",
      category: "Stationery Stories",
      price: 34.9,
      description:
        "Elegant writing paper and envelopes inspired by Tokyo night scenes.",
    },
    {
      name: "Neko Daily Planner",
      category: "Stationery Stories",
      price: 39.9,
      description: "A cute daily planner designed around a Japanese cat theme.",
    },
    {
      name: "Tokyo Sketchbook",
      category: "Stationery Stories",
      price: 32.9,
      description: "A clean sketchbook for drawings and travel memories.",
    },
    {
      name: "Pastel Gel Pen Set",
      category: "Stationery Stories",
      price: 24.9,
      description: "A colorful set of smooth pastel gel pens.",
    },
    {
      name: "Sakura Journal",
      category: "Stationery Stories",
      price: 42.9,
      description: "A premium hardcover journal inspired by spring in Japan.",
    },

    // Trinkets
    {
      name: "Lucky Cat Keychain",
      category: "Designer Trinkets",
      price: 25.9,
      description:
        "A charming miniature lucky cat accessory for bags and keys.",
    },
    {
      name: "Sakura Hair Clip",
      category: "Designer Trinkets",
      price: 19.9,
      description:
        "A delicate sakura-inspired hair accessory with a polished finish.",
    },
    {
      name: "Tiny Matcha Charm",
      category: "Designer Trinkets",
      price: 21.9,
      description:
        "A tiny matcha cup charm designed for bags and personal accessories.",
    },
    {
      name: "Moon Rabbit Pin",
      category: "Designer Trinkets",
      price: 27.9,
      description: "A collectible enamel pin featuring a moonlit rabbit motif.",
    },
    {
      name: "Tokyo Cat Brooch",
      category: "Designer Trinkets",
      price: 31.9,
      description: "A premium cat brooch inspired by Tokyo street fashion.",
    },
    {
      name: "Neko Bag Charm",
      category: "Designer Trinkets",
      price: 23.9,
      description: "A playful cat-shaped charm for everyday bags.",
    },
    {
      name: "Fuji Enamel Pin",
      category: "Designer Trinkets",
      price: 26.9,
      description: "A Mount Fuji inspired collectible enamel pin.",
    },
    {
      name: "Sakura Phone Charm",
      category: "Designer Trinkets",
      price: 18.9,
      description: "A delicate phone charm with a sakura design.",
    },

    // Gift Sets
    {
      name: "Sakura Self-Care Set",
      category: "Atelier Gift Sets",
      price: 129.9,
      description:
        "A curated gift box combining stationery, accessories and seasonal details.",
    },
    {
      name: "Cozy Afternoon Gift Box",
      category: "Atelier Gift Sets",
      price: 149.9,
      description: "A cozy gift collection designed for quiet afternoons.",
    },
    {
      name: "Tokyo Desk Starter Set",
      category: "Atelier Gift Sets",
      price: 119.9,
      description:
        "A curated desk collection for stationery lovers and remote workers.",
    },
    {
      name: "Little Joy Surprise Box",
      category: "Atelier Gift Sets",
      price: 99.9,
      description:
        "A playful surprise box filled with small Japanese-inspired treasures.",
    },
    {
      name: "Premium Kawaii Collection",
      category: "Atelier Gift Sets",
      price: 189.9,
      description: "A premium collection of boutique kawaii items.",
    },
    {
      name: "Weekend Relax Gift Set",
      category: "Atelier Gift Sets",
      price: 139.9,
      description: "A cozy weekend collection for relaxing evenings.",
    },
    {
      name: "Tokyo Birthday Gift Box",
      category: "Atelier Gift Sets",
      price: 169.9,
      description:
        "A colorful gift box designed for birthdays and celebrations.",
    },
    {
      name: "Friendship Gift Collection",
      category: "Atelier Gift Sets",
      price: 109.9,
      description: "A thoughtful collection designed for gifting friends.",
    },

    // Japanese Lifestyle
    {
      name: "Ceramic Matcha Cup",
      category: "Japanese Lifestyle",
      price: 49.9,
      description:
        "A minimalist ceramic cup inspired by traditional Japanese tea culture.",
    },
    {
      name: "Neko Tea Spoon",
      category: "Japanese Lifestyle",
      price: 24.9,
      description:
        "A cute cat-shaped tea spoon for matcha and everyday drinks.",
    },
    {
      name: "Japanese Aroma Candle",
      category: "Japanese Lifestyle",
      price: 59.9,
      description: "A calming scented candle inspired by Japanese gardens.",
    },
    {
      name: "Fuji Desk Ornament",
      category: "Japanese Lifestyle",
      price: 39.9,
      description: "A miniature Mount Fuji ornament for desks and shelves.",
    },
    {
      name: "Noren Mini Wall Decor",
      category: "Japanese Lifestyle",
      price: 44.9,
      description: "A compact Japanese-inspired fabric decoration.",
    },
    {
      name: "Matcha Bowl",
      category: "Japanese Lifestyle",
      price: 69.9,
      description: "A handmade-inspired ceramic bowl for matcha preparation.",
    },
    {
      name: "Tokyo Ceramic Plate",
      category: "Japanese Lifestyle",
      price: 54.9,
      description: "A minimal ceramic plate inspired by Japanese tableware.",
    },

    // Seasonal
    {
      name: "Autumn Maple Bear",
      category: "Seasonal Collection",
      price: 114.9,
      description:
        "A limited seasonal bear plush inspired by Japanese autumn foliage.",
    },
    {
      name: "Moon Festival Rabbit",
      category: "Seasonal Collection",
      price: 79.9,
      description:
        "A limited rabbit collectible inspired by moonlit autumn evenings.",
    },
    {
      name: "Pumpkin Cat Charm",
      category: "Seasonal Collection",
      price: 29.9,
      description: "A playful seasonal cat charm with a tiny pumpkin detail.",
    },
    {
      name: "Autumn Letter Set",
      category: "Seasonal Collection",
      price: 32.9,
      description: "Warm-toned stationery inspired by Japanese autumn colors.",
    },
    {
      name: "Harvest Gift Basket",
      category: "Seasonal Collection",
      price: 159.9,
      description:
        "A seasonal curated gift basket filled with cozy autumn-inspired items.",
    },
    {
      name: "Maple Leaf Notebook",
      category: "Seasonal Collection",
      price: 35.9,
      description: "A seasonal notebook featuring Japanese maple leaves.",
    },
  ] as const;

  const products: ProductData[] = [];

  for (let index = 0; index < productDefinitions.length; index++) {
    const definition = productDefinitions[index];

    if (!definition) {
      throw new Error(`Missing product definition at index ${index}`);
    }

    const categoryId = categoryMap.get(definition.category);

    if (categoryId === undefined) {
      throw new Error(`Missing category: ${definition.category}`);
    }

    const slug =
      definition.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + `-${index + 1}`;

    const product = await prisma.product.create({
      data: {
        name: definition.name,

        slug,

        sku: `KMB-${String(index + 1).padStart(4, "0")}`,

        description: definition.description,

        price: decimal(definition.price),

        categoryId,

        isActive: randomBoolean(0.96),

        createdAt: randomDate(START_DATE, new Date("2026-05-15T23:59:59.999Z")),
      },
    });

    products.push({
      productId: product.productId,

      name: product.name,

      price: product.price,
    });

    /**
     * 2-3 images per product
     */
    const imageCount = randomBoolean(0.8) ? 2 : 3;

    for (let imageIndex = 0; imageIndex < imageCount; imageIndex++) {
      await prisma.productImage.create({
        data: {
          productId: product.productId,

          url:
            `https://placehold.co/1000x1000?text=` +
            encodeURIComponent(definition.name) +
            `-${imageIndex + 1}`,

          altText: `${definition.name} image ${imageIndex + 1}`,

          isThumbnail: imageIndex === 0,

          sortOrder: imageIndex,
        },
      });
    }
  }

  console.log(`✓ Created ${products.length} products`);

  /**
   * =======================================================
   * 6. INVENTORY
   * =======================================================
   */

  console.log("");
  console.log("📦 Creating inventory...");

  const initialStock = new Map<number, number>();

  for (const product of products) {
    const stock = randomInt(80, 220);

    initialStock.set(product.productId, stock);

    await prisma.inventory.create({
      data: {
        productId: product.productId,

        stock,

        reorderAt: randomInt(15, 40),
      },
    });
  }

  console.log(`✓ Created ${products.length} inventory records`);

  /**
   * =======================================================
   * 7. USER ADDRESSES
   * =======================================================
   */

  console.log("");
  console.log("🏠 Creating addresses...");

  const addressTemplates = [
    {
      addressLine: "12 Jalan Bukit Bintang",
      city: "Kuala Lumpur",
      state: "Kuala Lumpur",
      postalCode: "55100",
      country: "Malaysia",
    },
    {
      addressLine: "25 Jalan SS15/4",
      city: "Subang Jaya",
      state: "Selangor",
      postalCode: "47500",
      country: "Malaysia",
    },
    {
      addressLine: "18 Jalan Austin Heights",
      city: "Johor Bahru",
      state: "Johor",
      postalCode: "81100",
      country: "Malaysia",
    },
    {
      addressLine: "33 Jalan Setia Alam",
      city: "Shah Alam",
      state: "Selangor",
      postalCode: "40170",
      country: "Malaysia",
    },
    {
      addressLine: "7 Jalan Taman Megah",
      city: "Petaling Jaya",
      state: "Selangor",
      postalCode: "47301",
      country: "Malaysia",
    },
    {
      addressLine: "41 Jalan Sutera",
      city: "Johor Bahru",
      state: "Johor",
      postalCode: "81200",
      country: "Malaysia",
    },
    {
      addressLine: "16 Jalan SS2",
      city: "Petaling Jaya",
      state: "Selangor",
      postalCode: "47300",
      country: "Malaysia",
    },
    {
      addressLine: "22 Jalan Ampang",
      city: "Kuala Lumpur",
      state: "Kuala Lumpur",
      postalCode: "50450",
      country: "Malaysia",
    },
  ];

  const addresses: AddressData[] = [];

  for (const customer of customers) {
    /**
     * 30% of customers get 2 addresses.
     */
    const addressCount = randomBoolean(0.3) ? 2 : 1;

    for (let index = 0; index < addressCount; index++) {
      const template = randomPick(addressTemplates);

      const address = await prisma.userAddress.create({
        data: {
          userId: customer.userId,

          addressLine: template.addressLine,

          city: template.city,

          state: template.state,

          postalCode: template.postalCode,

          country: template.country,

          createdAt: randomDate(customer.createdAt, END_DATE),
        },
      });

      addresses.push(address);
    }
  }

  console.log(`✓ Created ${addresses.length} addresses`);

  /**
   * =======================================================
   * 8. FAVOURITES
   * =======================================================
   */

  console.log("");
  console.log("❤️ Creating favourites...");

  const favouriteKeys = new Set<string>();

  for (const customer of customers) {
    const count = randomInt(2, 7);

    for (let index = 0; index < count; index++) {
      const product = randomPick(products);

      const key = `${customer.userId}:${product.productId}`;

      if (favouriteKeys.has(key)) {
        continue;
      }

      favouriteKeys.add(key);

      await prisma.favourite.create({
        data: {
          userId: customer.userId,

          productId: product.productId,

          createdAt: randomDate(customer.createdAt, END_DATE),
        },
      });
    }
  }

  console.log(`✓ Created ${favouriteKeys.size} favourites`);

  /**
   * =======================================================
   * 9. ORDERS
   * =======================================================
   *
   * May      55
   * June     65
   * July     80
   * August  105
   * September 95
   *
   * Total = 400
   */

  console.log("");
  console.log("🧾 Creating orders...");

  /**
   * Group addresses by user.
   */
  const addressesByUser = new Map<string, AddressData[]>();

  for (const address of addresses) {
    const list = addressesByUser.get(address.userId) ?? [];

    list.push(address);

    addressesByUser.set(address.userId, list);
  }

  /**
   * Track how many units were sold.
   */
  const soldQuantity = new Map<number, number>();

  /**
   * Monthly order distribution.
   */
  const monthlyOrders = [
    {
      name: "May",
      start: new Date("2026-05-01T00:00:00.000Z"),
      end: new Date("2026-05-31T23:59:59.999Z"),
      count: 55,
    },
    {
      name: "June",
      start: new Date("2026-06-01T00:00:00.000Z"),
      end: new Date("2026-06-30T23:59:59.999Z"),
      count: 65,
    },
    {
      name: "July",
      start: new Date("2026-07-01T00:00:00.000Z"),
      end: new Date("2026-07-31T23:59:59.999Z"),
      count: 80,
    },
    {
      name: "August",
      start: new Date("2026-08-01T00:00:00.000Z"),
      end: new Date("2026-08-31T23:59:59.999Z"),
      count: 105,
    },
    {
      name: "September",
      start: new Date("2026-09-01T00:00:00.000Z"),
      end: END_DATE,
      count: 95,
    },
  ];

  let orderCount = 0;

  for (const month of monthlyOrders) {
    console.log(`  ${month.name}: ${month.count} orders`);

    for (let orderIndex = 0; orderIndex < month.count; orderIndex++) {
      /**
       * Only customers who already existed
       * when the order was created can place it.
       */
      let orderDate = randomDate(month.start, month.end);

      let eligibleCustomers = customers.filter(
        (customer) => customer.createdAt <= orderDate,
      );

      /**
       * There should always be eligible
       * customers because the first customers
       * are created in May.
       */
      if (eligibleCustomers.length === 0) {
        const firstCustomer = customers.reduce((earliest, customer) =>
          customer.createdAt < earliest.createdAt ? customer : earliest,
        );

        orderDate = firstCustomer.createdAt;
        eligibleCustomers = [firstCustomer];
      }

      const customer = randomPick(eligibleCustomers);

      const customerAddressList = addressesByUser.get(customer.userId) ?? [];

      const address = randomPick(customerAddressList);

      /**
       * Decide status based on order age.
       */
      const ageInDays = Math.floor(
        (END_DATE.getTime() - orderDate.getTime()) / DAY_MS,
      );

      let status:
        | "PENDING"
        | "PAID"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED";

      if (ageInDays <= 2) {
        status = randomPick(["PENDING", "PENDING", "PAID"]);
      } else if (ageInDays <= 7) {
        status = randomPick(["PAID", "PAID", "PROCESSING", "PENDING"]);
      } else if (ageInDays <= 20) {
        status = randomPick([
          "PAID",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ]);
      } else {
        status = randomPick([
          "SHIPPED",
          "DELIVERED",
          "DELIVERED",
          "DELIVERED",
          "CANCELLED",
        ]);
      }

      /**
       * 1-5 products in an order.
       */
      const itemCount = randomInt(1, 5);

      const selectedProductIds = new Set<number>();

      while (selectedProductIds.size < itemCount) {
        selectedProductIds.add(randomPick(products).productId);
      }

      let total = new Prisma.Decimal(0);

      const orderItems = [];

      for (const productId of selectedProductIds) {
        const product = products.find((item) => item.productId === productId);

        if (!product) {
          continue;
        }

        const quantity = randomBoolean(0.8) ? randomInt(1, 2) : randomInt(3, 5);

        const itemTotal = product.price.mul(quantity);

        total = total.add(itemTotal);

        orderItems.push({
          productId: product.productId,

          quantity,

          price: product.price,
        });

        /**
         * Only count non-cancelled orders
         * as actual stock movement.
         */
        if (status !== "CANCELLED") {
          soldQuantity.set(
            product.productId,
            (soldQuantity.get(product.productId) ?? 0) + quantity,
          );
        }
      }

      await prisma.order.create({
        data: {
          userId: customer.userId,

          total,

          status,

          createdAt: orderDate,

          updatedAt: orderDate,

          deliveryAddressLine1: address.addressLine,

          deliveryAddressLine2: randomBoolean(0.15)
            ? `Unit ${randomInt(1, 30)}`
            : null,

          deliveryCity: address.city,

          deliveryCountry: address.country,

          deliveryName: customer.name,

          deliveryPostcode: address.postalCode,

          deliveryState: address.state,

          orderItems: {
            create: orderItems.map((item) => ({
              productId: item.productId,

              quantity: item.quantity,

              price: item.price,

              createdAt: orderDate,

              updatedAt: orderDate,
            })),
          },
        },
      });

      orderCount++;
    }
  }

  console.log(`✓ Created ${orderCount} orders`);

  /**
   * =======================================================
   * 10. UPDATE INVENTORY
   * =======================================================
   */

  console.log("");
  console.log("📦 Updating inventory...");

  for (const product of products) {
    const starting = initialStock.get(product.productId) ?? 0;

    const sold = soldQuantity.get(product.productId) ?? 0;

    const remaining = Math.max(0, starting - sold);

    await prisma.inventory.update({
      where: {
        productId: product.productId,
      },

      data: {
        stock: remaining,
      },
    });
  }

  console.log("✓ Inventory updated");

  /**
   * =======================================================
   * 11. CARTS
   * =======================================================
   */

  console.log("");
  console.log("🛒 Creating carts...");

  let cartCount = 0;

  for (const customer of customers) {
    /**
     * Around 65% have an active cart.
     */
    if (!randomBoolean(0.65)) {
      continue;
    }

    const cart = await prisma.cart.create({
      data: {
        userId: customer.userId,

        createdAt: randomDate(customer.createdAt, END_DATE),
      },
    });

    cartCount++;

    const itemCount = randomInt(1, 5);

    const selectedProducts = new Set<number>();

    while (selectedProducts.size < itemCount) {
      selectedProducts.add(randomPick(products).productId);
    }

    for (const productId of selectedProducts) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.cartId,

          productId,

          quantity: randomInt(1, 3),
        },
      });
    }
  }

  console.log(`✓ Created ${cartCount} carts`);

  /**
   * =======================================================
   * 12. REFRESH TOKENS
   * =======================================================
   */

  console.log("");
  console.log("🔑 Creating refresh tokens...");

  /**
   * Admin tokens.
   */
  const adminUsers = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });

  for (const admin of adminUsers) {
    const createdAt = daysAgo(randomInt(0, 10));

    const expiresAt = new Date(createdAt);

    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        token: crypto.randomBytes(48).toString("hex"),

        userId: admin.userId,

        createdAt,

        expiresAt,
      },
    });
  }

  /**
   * Customer tokens.
   */
  for (const customer of customers) {
    if (!randomBoolean(0.65)) {
      continue;
    }

    const createdAt = randomDate(customer.createdAt, END_DATE);

    const expiresAt = new Date(createdAt);

    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        token: crypto.randomBytes(48).toString("hex"),

        userId: customer.userId,

        createdAt,

        expiresAt,
      },
    });
  }

  /**
   * =======================================================
   * 13. SUMMARY
   * =======================================================
   */

  console.log("");
  console.log("📊 Calculating summary...");

  const [
    userCount,
    adminCount,
    customerCount,
    categoryCount,
    productCount,
    imageCount,
    inventoryCount,
    addressCount,
    favouriteCount,
    cartCountFinal,
    cartItemCount,
    orderCountFinal,
    orderItemCount,
    refreshTokenCount,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.user.count({
      where: {
        role: "USER",
      },
    }),

    prisma.category.count(),

    prisma.product.count(),

    prisma.productImage.count(),

    prisma.inventory.count(),

    prisma.userAddress.count(),

    prisma.favourite.count(),

    prisma.cart.count(),

    prisma.cartItem.count(),

    prisma.order.count(),

    prisma.orderItem.count(),

    prisma.refreshToken.count(),
  ]);

  /**
   * Revenue
   */
  const revenueResult = await prisma.order.aggregate({
    _sum: {
      total: true,
    },

    where: {
      status: {
        not: "CANCELLED",
      },
    },
  });

  console.log("");
  console.log("==================================================");

  console.log("🌸 KOMOREBI SEED COMPLETE");

  console.log("==================================================");

  console.log("");

  console.log("USERS");
  console.log(`  Total:          ${userCount}`);
  console.log(`  Admins:         ${adminCount}`);
  console.log(`  Customers:      ${customerCount}`);

  console.log("");

  console.log("CATALOG");
  console.log(`  Categories:     ${categoryCount}`);
  console.log(`  Products:       ${productCount}`);
  console.log(`  Product Images: ${imageCount}`);
  console.log(`  Inventory:      ${inventoryCount}`);

  console.log("");

  console.log("CUSTOMERS");
  console.log(`  Addresses:      ${addressCount}`);
  console.log(`  Favourites:     ${favouriteCount}`);

  console.log("");

  console.log("SHOPPING");
  console.log(`  Carts:          ${cartCountFinal}`);
  console.log(`  Cart Items:     ${cartItemCount}`);

  console.log("");

  console.log("ORDERS");
  console.log(`  Orders:         ${orderCountFinal}`);
  console.log(`  Order Items:    ${orderItemCount}`);
  console.log(
    `  Revenue:        RM ${revenueResult._sum.total?.toFixed(2) ?? "0.00"}`,
  );

  console.log("");

  console.log("AUTH");
  console.log(`  Refresh Tokens: ${refreshTokenCount}`);

  console.log("");

  console.log("==================================================");

  console.log("");
  console.log("🔐 TEST ACCOUNTS");
  console.log("");
  console.log("Admin:    admin@komorebi.com");
  console.log("Password: Password123!");

  console.log("");
  console.log("Admin:    manager@komorebi.com");
  console.log("Password: Password123!");

  console.log("");
  console.log("Customer: customer001@example.com");
  console.log("Password: Password123!");

  console.log("");
  console.log("==================================================");
}

/**
 * =========================================================
 * RUN
 * =========================================================
 */

main()
  .catch((error) => {
    console.error("");
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
