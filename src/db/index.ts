import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ DATABASE_URL is missing. Build might fail if SSG pages are generated.");
}

declare global {
  var postgresClient: postgres.Sql | undefined;
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = globalThis.postgresClient || postgres(connectionString, { prepare: false });
if (process.env.NODE_ENV !== "production") {
  globalThis.postgresClient = client;
}

export const db = drizzle(client, { schema });
