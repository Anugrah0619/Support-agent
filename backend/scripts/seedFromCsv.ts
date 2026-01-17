import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";

/* -------------------------------------------------
   GLOBAL ERROR VISIBILITY (TEMP BUT SAFE)
------------------------------------------------- */

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION:", error);
});

/* -------------------------------------------------
   PRISMA
------------------------------------------------- */

const prisma = new PrismaClient();

/* -------------------------------------------------
   ESM __dirname FIX
------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------
   DATA DIRECTORY
------------------------------------------------- */

const DATA_DIR = path.join(__dirname, "../data/seed");
console.log("📁 Resolved DATA_DIR:", DATA_DIR);

/* -------------------------------------------------
   SIMPLE CSV READER (SYNC, RELIABLE)
------------------------------------------------- */

function readCSV(filePath: string): any[] {
  console.log("📄 Reading CSV:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  const lines = fileContent
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    console.warn("⚠️ CSV has no data rows:", filePath);
    return [];
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? null;
    });

    rows.push(row);
  }

  return rows;
}

/* -------------------------------------------------
   USERS
------------------------------------------------- */

async function seedUsers() {
  const users = readCSV(path.join(DATA_DIR, "users.csv"));
  console.log("👤 Users CSV rows:", users.length);

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: Number(user.id) },
      update: {},
      create: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
      },
    });
  }

  console.log("✅ Users seeded");
}

/* -------------------------------------------------
   ORDERS
------------------------------------------------- */

async function seedOrders() {
  const orders = readCSV(path.join(DATA_DIR, "orders.csv"));
  console.log("📦 Orders CSV rows:", orders.length);

  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: Number(order.id) },
      update: {},
      create: {
        id: Number(order.id),
        userId: Number(order.user_id),
        status: order.status,
        placedAt: new Date(order.placed_at),
        deliveryDate: order.delivery_date
          ? new Date(order.delivery_date)
          : null,
      },
    });
  }

  console.log("✅ Orders seeded");
}

/* -------------------------------------------------
   PAYMENTS
------------------------------------------------- */

async function seedPayments() {
  const payments = readCSV(path.join(DATA_DIR, "payments.csv"));
  console.log("💳 Payments CSV rows:", payments.length);

  for (const payment of payments) {
    await prisma.payment.upsert({
      where: { id: Number(payment.id) },
      update: {},
      create: {
        id: Number(payment.id),
        userId: Number(payment.user_id),
        orderId: Number(payment.order_id),
        amount: Number(payment.amount),
        paymentStatus: payment.payment_status,
        refundStatus: payment.refund_status,
      },
    });
  }

  console.log("✅ Payments seeded");
}

/* -------------------------------------------------
   MAIN
------------------------------------------------- */

async function main() {
  try {
    await seedUsers();
    await seedOrders();
    await seedPayments();
    console.log("🎉 ALL DATA SEEDED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ SEEDING FAILED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
