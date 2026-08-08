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

export const getCartProducts = async (userId: string) => {
  try {
    const cartProducts = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      select: cartItemSelect,
    });

    return cartProducts;
  } catch (error) {
    throw new Error("Failed to retrieve cart products");
  }
};

const createCart = async (userId: string, data: CartItem[]) => {
  const cart = await prisma.cart.create({
    data: {
      userId: userId,
      items: {
        create: data,
      },
    },
  });
  return cart;
};

export const getCartItem = async (userId: string, itemId: string) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
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
  try {
    const cart = await prisma.cart.update({
      where: {
        userId: userId,
      },
      data: {
        items: {
          update: {
            where: {
              id: itemId,
            },
            data: {
              quantity: quantity,
            },
          },
        },
      },
      select: cartItemSelect,
    });
    return cart;
  } catch (error) {
    throw new Error("Failed to update cart item");
  }
};

export const addCartItem = async (userId: string, item: CartItem) => {
  const cart = await getCartProducts(userId);
  if (!cart) {
    return createCart(userId, [item]);
  }
  if (item.quantity <= 0 || !item.quantity) {
    throw new Error("Quantity must be greater than zero");
  }

  // check if the item already exists in the cart
  const existingItem = cart.items.find(
    (cartItem) => cartItem.productId === item.productId,
  );

  if (existingItem) {
    // If the item already exists, update its quantity
    return updateCartItem({
      userId,
      itemId: existingItem.id,
      quantity: existingItem.quantity + item.quantity,
    });
  }

  return prisma.cart.update({
    where: {
      userId: userId,
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
  try {
    // validate if the cart exists for the user
    await getCartItem(userId, itemId);
    const updatedCart = await prisma.cart.update({
      where: {
        userId: userId,
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
    return updatedCart;
  } catch (error) {
    throw new Error("Failed to delete cart item");
  }
};

export const clearCart = async (userId: string) => {
  try {
    const updatedCart = await prisma.cart.update({
      where: {
        userId: userId,
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
      select: cartItemSelect,
    });
    return updatedCart;
  } catch (error) {
    throw new Error("Failed to clear cart");
  }
};
