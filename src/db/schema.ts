import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  basePrice: varchar("base_price", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description"),
  images: jsonb("images").default([]).notNull(),
  variantGroups: jsonb("variant_groups").default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 50 }).primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerAddress: text("customer_address"),
  customerNotes: text("customer_notes"),
  customerLatitude: varchar("customer_latitude", { length: 255 }),
  customerLongitude: varchar("customer_longitude", { length: 255 }),
  deliveryMethod: varchar("delivery_method", { length: 50 }).notNull().default("delivery"),
  totalAmount: varchar("total_amount", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Menunggu Pembayaran"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 50 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  // Snapshot data to avoid changes when product price changes in the future
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: varchar("product_image", { length: 255 }),
  productPrice: varchar("product_price", { length: 255 }).notNull(),
  productCategory: varchar("product_category", { length: 255 }),
  quantity: integer("quantity").notNull(),
  variantDetails: jsonb("variant_details").default([]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 50 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  midtransTransactionId: varchar("midtrans_transaction_id", { length: 255 }),
  paymentToken: varchar("payment_token", { length: 255 }),
  paymentUrl: varchar("payment_url", { length: 255 }),
  paymentMethod: varchar("payment_method", { length: 100 }),
  paymentDetails: jsonb("payment_details"),
  amount: varchar("amount", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"), // "info", "order", "payment", "system"
  isRead: boolean("is_read").default(false).notNull(),
  link: varchar("link", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  phoneWa: varchar("phone_wa", { length: 50 }).notNull(),
  instagram: varchar("instagram", { length: 255 }).notNull(),
  address: text("address").notNull(),
  openingHours: varchar("opening_hours", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const heroBanners = pgTable("hero_banners", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle").notNull(),
  position: integer("position").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  gridClass: varchar("grid_class", { length: 100 }).notNull().default("md:col-span-1 md:row-span-1"),
  altText: varchar("alt_text", { length: 255 }).notNull(),
  position: integer("position").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
