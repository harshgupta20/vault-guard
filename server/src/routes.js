// src/routes.js
const express = require("express");
const router = express.Router();
const { Prisma } = require("@prisma/client");
const { isValidWalletAddress, requireFields } = require("./validation");

module.exports = (prisma) => {
  // POST /users
  router.post("/users", async (req, res) => {
    const { publicAddress } = req.body;
    if (!publicAddress)
      return res.status(400).json({ error: "publicAddress is required" });
    if (!isValidWalletAddress(publicAddress)) {
      return res
        .status(400)
        .json({ error: "publicAddress is not a valid wallet address format" });
    }

    try {
      const user = await prisma.user.create({
        data: { publicAddress },
      });
      return res.status(201).json(user);
    } catch (err) {
      // unique conflict
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(409).json({ error: "User already exists" });
      }
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /friends
  router.post("/friends", async (req, res) => {
    const { publicAddress, friendName, friendEmail, friendWalletAddress } =
      req.body;

    const missing = requireFields(req.body, [
      "publicAddress",
      "friendName",
      "friendWalletAddress",
    ]);
    if (missing.length) {
      return res
        .status(400)
        .json({ error: "Missing required fields", missing });
    }

    if (!isValidWalletAddress(publicAddress)) {
      return res.status(400).json({ error: "publicAddress is not valid" });
    }
    if (!isValidWalletAddress(friendWalletAddress)) {
      return res
        .status(400)
        .json({ error: "friendWalletAddress is not valid" });
    }

    try {
      // Ensure user exists
      const owner = await prisma.user.findUnique({ where: { publicAddress } });
      if (!owner) {
        return res
          .status(400)
          .json({
            error: "Owner (publicAddress) does not exist. Create user first.",
          });
      }

      const friend = await prisma.friend.create({
        data: {
          publicAddress,
          friendWalletAddress,
          friendName,
          friendEmail: friendEmail || null,
        },
      });

      return res.status(201).json(friend);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        // Unique constraint failed on the composite id (duplicate friend for this owner)
        return res
          .status(409)
          .json({ error: "Friend already exists for this publicAddress" });
      }
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /friends?publicAddress=0x...
  router.get("/friends", async (req, res) => {
    const publicAddress = req.query.publicAddress;
    if (!publicAddress)
      return res
        .status(400)
        .json({ error: "publicAddress query param is required" });
    if (!isValidWalletAddress(publicAddress)) {
      return res.status(400).json({ error: "publicAddress is not valid" });
    }

    try {
      const friends = await prisma.friend.findMany({
        where: { publicAddress },
        orderBy: { createdAt: "desc" },
      });
      return res.json(friends);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
