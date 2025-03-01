/*
  Warnings:

  - A unique constraint covering the columns `[gameDate]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_gameDate_key" ON "Game"("gameDate");
