import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

declare global {
  var postgresClient: postgres.Sql | undefined;
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = globalThis.postgresClient || postgres(connectionString, { 
  prepare: false,
  max: process.env.NODE_ENV === "production" ? 1 : undefined
});
if (process.env.NODE_ENV !== "production") {
  globalThis.postgresClient = client;
}

export const db = drizzle(client, { schema });
