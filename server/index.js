const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

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

// GET endpoint to retrieve friends by public address
app.get("/friends/:publicAddress", async (req, res) => {
  try {
    const { publicAddress } = req.params;

    if (!publicAddress) {
      return res.status(400).json({
        error: "Public address is required",
      });
    }

    // Find user by public address
    const user = await prisma.user.findUnique({
      where: {
        publicAddress: publicAddress,
      },
      include: {
        friends: {
          include: {
            friend: {
              select: {
                id: true,
                publicAddress: true,
                walletAddress: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Extract friend information
    const friends = user.friends.map((friendship) => ({
      id: friendship.friend.id,
      publicAddress: friendship.friend.publicAddress,
      walletAddress: friendship.friend.walletAddress,
      name: friendship.friend.name,
      email: friendship.friend.email,
      addedAt: friendship.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          publicAddress: user.publicAddress,
          walletAddress: user.walletAddress,
          name: user.name,
          email: user.email,
        },
        friends: friends,
        totalFriends: friends.length,
      },
    });
  } catch (error) {
    console.error("Error retrieving friends:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// POST endpoint to add a new friend
app.post("/friends", async (req, res) => {
  try {
    const { name, email, walletAddress, publicAddress } = req.body;

    // Validate required fields
    if (!name || !email || !walletAddress || !publicAddress) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "walletAddress", "publicAddress"],
      });
    }

    // Check if friend already exists
    const existingFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { publicAddress: publicAddress },
          { walletAddress: walletAddress },
          { email: email },
        ],
      },
    });

    if (existingFriend) {
      return res.status(409).json({
        error: "Friend already exists",
        message:
          "A user with this public address, wallet address, or email already exists",
      });
    }

    // Create new friend
    const newFriend = await prisma.friend.create({
      data: {
        name,
        email,
        walletAddress,
        publicAddress,
      },
      select: {
        id: true,
        publicAddress: true,
        walletAddress: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Friend added successfully",
      data: newFriend,
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// POST endpoint to establish friendship between two users
app.post("/friends/connect", async (req, res) => {
  try {
    const { userPublicAddress, friendPublicAddress } = req.body;

    if (!userPublicAddress || !friendPublicAddress) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userPublicAddress", "friendPublicAddress"],
      });
    }

    if (userPublicAddress === friendPublicAddress) {
      return res.status(400).json({
        error: "Cannot add yourself as a friend",
      });
    }

    // Find both users
    const [user, friend] = await Promise.all([
      prisma.user.findUnique({
        where: { publicAddress: userPublicAddress },
      }),
      prisma.user.findUnique({
        where: { publicAddress: friendPublicAddress },
      }),
    ]);

    if (!user || !friend) {
      return res.status(404).json({
        error: "One or both users not found",
      });
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: user.id, friendId: friend.id },
          { userId: friend.id, friendId: user.id },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(409).json({
        error: "Friendship already exists",
      });
    }

    // Create friendship (bidirectional)
    await prisma.friend.createMany({
      data: [
        { userId: user.id, friendId: friend.id },
        { userId: friend.id, friendId: user.id },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Friendship established successfully",
      data: {
        user: {
          id: user.id,
          publicAddress: user.publicAddress,
          name: user.name,
        },
        friend: {
          id: friend.id,
          publicAddress: friend.publicAddress,
          name: friend.name,
        },
      },
    });
  } catch (error) {
    console.error("Error establishing friendship:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ETH Global Server is running",
    endpoints: {
      "POST /will/prepare": "Prepare a will with nominees and deadline",
      "GET /friends/:publicAddress": "Get friends list by public address",
      "POST /friends": "Add a new friend",
      "POST /friends/connect": "Connect two users as friends",
      "GET /health": "Health check endpoint",
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Will prepare endpoint: http://localhost:${PORT}/will/prepare`);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("shutting down");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
