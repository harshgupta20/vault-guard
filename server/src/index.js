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

// ensure prisma disconnects gracefully on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
