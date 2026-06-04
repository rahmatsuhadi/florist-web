import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

declare global {
  var postgresClient: postgres.Sql | undefined;
}

type DbType = ReturnType<typeof drizzle<typeof schema>>;

let client: postgres.Sql | undefined;
let dbInstance: DbType | null;

if (connectionString) {
  client = globalThis.postgresClient || postgres(connectionString, { prepare: false });
  if (process.env.NODE_ENV !== "production") {
    globalThis.postgresClient = client;
  }
  dbInstance = drizzle(client, { schema });
} else {
  client = undefined;
  dbInstance = null;
}

// Export as non-null for backward compatibility (services will handle null at runtime)
export const db = dbInstance as DbType;
export { client };
