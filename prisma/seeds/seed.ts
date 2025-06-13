import prisma from "../../app/lib/db.server.ts";
import userData from "../data/test-data/users.ts";
import gameData from "../data/test-data/games.ts";
import resultData, { ResultSeedEntry } from "../data/test-data/results.ts";
import { GameStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export interface userData {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface gameData {
  gameDate: Date;
  answer: {
    rgb: number[];
    hex: string;
  };
}

export interface resultData {
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
  guesses: number[][];
}

export interface seedData {
  userData: userData[];
  gameData: gameData[];
  resultData: resultData[];
}

const seed = async ({ userData, gameData, resultData }: seedData) => {
  // Remove existing data
  process.env.NODE_ENV !== "test" && console.log("Clearing tables...");
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  process.env.NODE_ENV !== "test" && console.log("✅ Tables cleared");

  // Seed Users
  process.env.NODE_ENV !== "test" && console.log("Creating users...");
  await prisma.user.createMany({ data: userData });
  const userIds = await prisma.user.findMany({ select: { id: true } });
  process.env.NODE_ENV !== "test" && console.log("✅ Users created");

  // Seed Games
  process.env.NODE_ENV !== "test" && console.log("Creating games...");
  await prisma.game.createMany({ data: gameData });
  const gameIds = await prisma.game.findMany({
    select: { id: true, answer: true, gameDate: true },
  });
  process.env.NODE_ENV !== "test" && console.log("✅ Games created");

  // Seed Results
  /* process.env.NODE_ENV !== "test" && console.log("Creating results...");
  const results = resultData.map((result, index) => {
    const returnResult = {
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      guesses: result.guesses,
      userId: userIds[Math.floor(Math.random() * 10)].id,
      gameId: gameIds[Math.floor(Math.random() * 10)].id,
    };

    return returnResult;
  });

  await prisma.result.createMany({
    data: results,
  }); */

  process.env.NODE_ENV !== "test" && console.log("Creating results...");

  const usedPairs = new Set<string>();

  const resultsWithIds = [];

  while (resultsWithIds.length < resultData.length) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)].id;
    const gameId = gameIds[Math.floor(Math.random() * gameIds.length)].id;
    const pairKey = `${userId}-${gameId}`;

    if (!usedPairs.has(pairKey)) {
      usedPairs.add(pairKey);

      const baseResult: ResultSeedEntry = resultData[resultsWithIds.length];

      resultsWithIds.push({
        id: uuidv4(),
        status: baseResult.status,
        createdAt: baseResult.createdAt,
        updatedAt: baseResult.updatedAt,
        userId,
        gameId,
        guesses: baseResult.guesses,
      });
    }
  }

  // Insert results first, without guesses
  await prisma.result.createMany({
    data: resultsWithIds.map(({ guesses, ...rest }) => rest),
  });

  // Then insert guesses separately, something like:
  for (const result of resultsWithIds) {
    for (let i = 0; i < result.guesses.length; i++) {
      await prisma.guess.create({
        data: {
          guess: result.guesses[i], // your guess JSON array
          order: i,
          resultId: result.id,
        },
      });
    }
  }

  process.env.NODE_ENV !== "test" && console.log("✅ Results created");

  process.env.NODE_ENV !== "test" && console.log("🙌 Seeding complete!");
};

/* seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  }); */

export default seed;
