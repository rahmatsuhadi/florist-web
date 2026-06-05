import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function drop() {
  console.log("Dropping order tables...");
  await db.execute(sql`DROP TABLE IF EXISTS payments CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS order_items CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS orders CASCADE;`);
  console.log("Dropped!");
  process.exit(0);
}

drop();
