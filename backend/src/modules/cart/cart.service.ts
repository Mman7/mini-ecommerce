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
        },
      },
    },
  },
} as const;

export const getCartItems = async (userId: string) => {
  return prisma.cart.findUnique({
    where: {
      userId,
    },
    select: cartItemSelect,
  });
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

  if (!item) {
    throw new Error("Cart item not found");
  }

  return item;
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
  return prisma.cart.update({
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
};

export const addCartItem = async (userId: string, item: CartItem) => {
  if (item.quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  return prisma.cart.update({
    where: {
      userId,
    },
    data: {
      items: {
        create: [item],
      },
    },
    select: cartItemSelect,
  });
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

  return prisma.cart.update({
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
};

export const clearCart = async (userId: string) => {
  return prisma.cart.update({
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
};
