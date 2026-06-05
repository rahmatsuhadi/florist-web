import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import util from "util";


const connectionString = process.env.DATABASE_URL!;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ DATABASE_URL is missing. Build might fail if SSG pages are generated.");
}

declare global {
  var postgresClient: postgres.Sql | undefined;
}

const isDev = process.env.NODE_ENV === "development";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = globalThis.postgresClient || postgres(connectionString, { prepare: false });
if (process.env.NODE_ENV !== "production") {
  globalThis.postgresClient = client;
}

export const db = drizzle(client, {
  schema, logger: isDev
    ? {
        logQuery(query, params) {
          // 1. Filter query internal Next.js atau query boilerplate yang tidak perlu dipantau
          if (query.includes("select 1") || query.includes("listen ")) return;

          // 2. Format Query Utama (Cyan)
          console.log(`\n\x1b[36m[Drizzle ORM]\x1b[0m ${query}`);

          // 3. Format Parameter (Magenta) Menggunakan util.inspect agar object/array tercetak rapi
          if (params && params.length > 0) {
            const formattedParams = util.inspect(params, {
              colors: true,
              depth: null,
              compact: true,
            });
            console.log(`\x1b[35m[Parameters]\x1b[0m ${formattedParams}`);
          }

          // 4. Garis pemisah tipis untuk mempermudah pembacaan antar query
          console.log(`\x1b[90m--------------------------------------------------\x1b[0m`);
        },
      }
    : false
});
