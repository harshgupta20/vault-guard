// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const createRoutes = require("./routes");

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

// attach routes
app.use("/", createRoutes(prisma));

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// global error handler (fallback)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function connectWithRetry({
  maxRetries = 5,
  initialDelayMs = 1000,
  factor = 2,
} = {}) {
  let attempt = 0;
  let delay = initialDelayMs;
  while (attempt < maxRetries) {
    try {
      console.log(`[db] attempt ${attempt + 1} to connect...`);
      // $connect opens the connection pool
      await prisma.$connect();
      // optional cheap check
      await prisma.$queryRaw`SELECT 1`;
      console.log("[db] connected");
      return; // success
    } catch (err) {
      console.error(
        `[db] connect failed (attempt ${attempt + 1}):`,
        err.message || err
      );
      attempt++;
      if (attempt >= maxRetries) break;
      console.log(`[db] retrying in ${delay}ms...`);
      await sleep(delay);
      delay *= factor;
    }
  }
  throw new Error("Could not connect to DB after retries");
}

(async function start() {
  try {
    await connectWithRetry({ maxRetries: 6, initialDelayMs: 1000, factor: 2 });
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error(
      "[startup] fatal: could not connect to DB — exiting.",
      err.message || err
    );
    // crash so orchestrator can restart the service (or fix env)
    process.exit(1);
  }
})();

// ensure prisma disconnects gracefully on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
