/*
  Warnings:

  - You are about to drop the `Tax` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tax";

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
