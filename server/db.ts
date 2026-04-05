import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  InsertUser,
  users,
  products,
  cartItems,
  orders,
  orderItems,
  userAddresses,
  productReviews,
  wishlist,
  InsertProduct,
  InsertCartItem,
  InsertOrder,
  InsertOrderItem,
  InsertUserAddress,
  InsertProductReview,
  InsertWishlistItem,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

const sqlitePath = (process.env.DATABASE_URL || "file:db.db").replace(
  /^file:/,
  "",
);
const sqlite = new Database(sqlitePath);
sqlite.pragma("foreign_keys = ON");
const _db = drizzle(sqlite);

export async function getDb() {
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = [
      "name",
      "email",
      "loginMethod",
      "passwordHash",
    ] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({ target: users.openId, set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== PRODUCTS =====
export async function getProducts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(products).where(eq(products.id, id));

  return result[0] || null;
}

export async function getProductsByCategory(
  category: string,
  limit = 20,
  offset = 0,
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .limit(limit)
    .offset(offset);
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .insert(products)
    .values(data)
    .returning({ id: products.id });
  return result[0]?.id ?? 0;
}

// ===== CART =====
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(data: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .insert(cartItems)
    .values(data)
    .returning({ id: cartItems.id });
  return result[0]?.id ?? 0;
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeFromCart(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ===== ORDERS =====
export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .insert(orders)
    .values(data)
    .returning({ id: orders.id });
  return result[0]?.id ?? 0;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(orders).where(eq(orders.id, id));

  return result[0] || null;
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(orders)
    .set({ status: status as any })
    .where(eq(orders.id, id));
}

// ===== ORDER ITEMS =====
export async function addOrderItems(items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orderItems).values(items).returning({ id: orderItems.id });
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// ===== USER ADDRESSES =====
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, userId));
}

export async function getDefaultAddress(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, userId))
    .where(eq(userAddresses.isDefault, true));

  return result[0] || null;
}

export async function createAddress(data: InsertUserAddress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .insert(userAddresses)
    .values(data)
    .returning({ id: userAddresses.id });
  return result[0]?.id ?? 0;
}

export async function updateAddress(
  id: number,
  data: Partial<InsertUserAddress>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userAddresses).set(data).where(eq(userAddresses.id, id));
}

export async function deleteAddress(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(userAddresses).where(eq(userAddresses.id, id));
}

// ===== PRODUCT REVIEWS =====
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(productReviews)
    .where(eq(productReviews.productId, productId))
    .orderBy(desc(productReviews.createdAt));
}

export async function createReview(data: InsertProductReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .insert(productReviews)
    .values(data)
    .returning({ id: productReviews.id });
  return result[0]?.id ?? 0;
}

// ===== WISHLIST =====
export async function getWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(wishlist).where(eq(wishlist.userId, userId));
}

export async function addToWishlist(data: InsertWishlistItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .insert(wishlist)
    .values(data)
    .returning({ id: wishlist.id });
  return result[0]?.id ?? 0;
}

export async function removeFromWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(wishlist)
    .where(eq(wishlist.userId, userId))
    .where(eq(wishlist.productId, productId));
}
