import 'dotenv/config';
import { db } from './src/db';
import { users } from './src/db/schema';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  console.log("Seeding admin user...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  try {
    await db.insert(users).values({
      name: "Admin Utama",
      email: "admin@fleuriste.com",
      passwordHash,
      role: "Superadmin",
    });
    console.log("Admin seeded successfully!");
  } catch (error: any) {
    if (error.code === '23505') { // unique_violation
      console.log("Admin already exists in the database.");
    } else {
      console.error("Error seeding admin:", error);
    }
  }
  process.exit(0);
}

seedAdmin();
