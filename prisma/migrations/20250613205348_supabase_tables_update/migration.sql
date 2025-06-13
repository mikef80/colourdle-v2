/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Result` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('W', 'L', 'A', 'P');

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "status",
ADD COLUMN     "status" "GameStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Guess" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "guess" JSONB NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_gameId_key" ON "Result"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
