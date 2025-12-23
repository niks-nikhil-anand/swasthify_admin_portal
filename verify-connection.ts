import "dotenv/config";
import { db as prisma } from "./lib/db";

async function main() {
  try {
    console.log("Attempting to connect...");
    const count = await prisma.user.count();
    console.log("Connection successful! User count:", count);
  } catch (e) {
    console.error("Connection failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
