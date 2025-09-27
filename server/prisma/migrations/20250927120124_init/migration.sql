-- CreateTable
CREATE TABLE "User" (
    "publicAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("publicAddress")
);

-- CreateTable
CREATE TABLE "Friend" (
    "publicAddress" TEXT NOT NULL,
    "friendWalletAddress" TEXT NOT NULL,
    "friendName" TEXT NOT NULL,
    "friendEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("publicAddress","friendWalletAddress")
);

-- CreateIndex
CREATE INDEX "Friend_publicAddress_idx" ON "Friend"("publicAddress");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_publicAddress_fkey" FOREIGN KEY ("publicAddress") REFERENCES "User"("publicAddress") ON DELETE CASCADE ON UPDATE CASCADE;
