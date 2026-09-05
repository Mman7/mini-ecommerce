import { prisma } from "../../utils/prisma.ts";
import type { CartItem } from "../../types/cart.d.ts";

const cartItemSelect = {
  userId: true,
  items: {
    select: {
      id: true,
      productId: true,
      quantity: true,
      product: {
        select: {
          name: true,
          description: true,
          price: true,
          isActive: true,
          inventory: {
            select: {
              stock: true,
            },
          },
          productImages: {
            select: {
              url: true,
              altText: true,
              isThumbnail: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  },
} as const;

function serializeCart(cart: any) {
  if (!cart) return cart;

  return {
    ...cart,
    items: cart.items.map((item: any) => {
      const { inventory, ...product } = item.product;
      return {
        ...item,
        product: {
          ...product,
          stock: inventory?.stock ?? 0,
        },
      };
    }),
  };
}

export const getCartItems = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    select: cartItemSelect,
  });

  return serializeCart(cart);
};

const createCart = async (userId: string, data: CartItem[]) => {
  return prisma.cart.create({
    data: {
      userId,
      items: {
        create: data,
      },
    },
  });
};

export const getCartItem = async (userCartId: string, productId: number) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      cart: {
        userId: userCartId,
      },
      productId,
    },
  });

  return item;
};

export const getCartItemById = async (userId: string, itemId: string) => {
  return prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });
};

export const updateCartItem = async ({
  userId,
  itemId,
  quantity,
}: {
  userId: string;
  itemId: string;
  quantity: number;
}) => {
  const cart = await prisma.cart.update({
    where: {
      userId,
    },
    data: {
      items: {
        update: {
          where: {
            id: itemId,
          },
          data: {
            quantity,
          },
        },
      },
    },
    select: cartItemSelect,
  });

  return serializeCart(cart);
};

export const addCartItem = async (userId: string, item: CartItem) => {
  if (item.quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: {
      userId,
      items: {
        create: [item],
      },
    },
    update: {
      items: {
        create: [item],
      },
    },
    select: cartItemSelect,
  });

  return serializeCart(cart);
};

export const deleteCartItem = async ({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) => {
  // Check if the item exists in the cart before attempting to delete it
  await getCartItems(userId);

  const cart = await prisma.cart.update({
    where: {
      userId,
    },
    data: {
      items: {
        delete: {
          id: itemId,
        },
      },
    },
    select: cartItemSelect,
  });

  return serializeCart(cart);
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.update({
    where: {
      userId,
    },
    data: {
      items: {
        deleteMany: {},
      },
    },
    select: cartItemSelect,
  });

  return serializeCart(cart);
};
