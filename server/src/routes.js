// src/routes.js
const express = require("express");
const router = express.Router();
const { Prisma } = require("@prisma/client");
const { isValidWalletAddress, requireFields } = require("./validation");

module.exports = (prisma) => {
  // POST /users
  router.post("/users", async (req, res) => {
    const { publicAddress } = req.body;

    if (!publicAddress) {
      return res.status(400).json({
        success: false,
        message: "publicAddress is required",
        data: {},
      });
    }

    if (!isValidWalletAddress(publicAddress)) {
      return res.status(400).json({
        success: false,
        message: "publicAddress is not a valid wallet address format",
        data: {},
      });
    }

    try {
      const user = await prisma.user.create({
        data: { publicAddress },
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      // unique conflict
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
          data: {},
        });
      }

      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: {},
      });
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
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: { missing },
      });
    }

    if (!isValidWalletAddress(publicAddress)) {
      return res.status(400).json({
        success: false,
        message: "publicAddress is not valid",
        data: {},
      });
    }

    if (!isValidWalletAddress(friendWalletAddress)) {
      return res.status(400).json({
        success: false,
        message: "friendWalletAddress is not valid",
        data: {},
      });
    }

    try {
      // Ensure user exists
      const owner = await prisma.user.findUnique({ where: { publicAddress } });
      if (!owner) {
        return res.status(400).json({
          success: false,
          message: "Owner (publicAddress) does not exist. Create user first.",
          data: {},
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

      return res.status(201).json({
        success: true,
        message: "Friend added successfully",
        data: friend,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        // Unique constraint failed on the composite id (duplicate friend for this owner)
        return res.status(409).json({
          success: false,
          message: "Friend already exists for this publicAddress",
          data: {},
        });
      }

      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: {},
      });
    }
  });

  // GET /friends?publicAddress=0x...
  // GET /friends/:publicAddress
  router.get("/friends/:publicAddress", async (req, res) => {
    const { publicAddress } = req.params;

    if (!publicAddress) {
      return res.status(400).json({
        success: false,
        message: "publicAddress param is required",
        data: {},
      });
    }

    if (!isValidWalletAddress(publicAddress)) {
      return res.status(400).json({
        success: false,
        message: "publicAddress is not valid",
        data: {},
      });
    }

    try {
      const friends = await prisma.friend.findMany({
        where: { publicAddress },
        orderBy: { createdAt: "desc" },
      });

      return res.json({
        success: true,
        message: "Friends fetched successfully",
        data: { friends },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: {},
      });
    }
  });

  return router;
};
