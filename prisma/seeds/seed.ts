import prisma from "../../app/db/client.server.ts";
import userData from "../data/test-data/users.ts";
import gameData from "../data/test-data/games.ts";
import resultData from "../data/test-data/results.ts";

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
  status: string;
  createdAt: string;
  updatedAt: string;
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
  process.env.NODE_ENV !== "test" && console.log("Creating results...");
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
  });
  process.env.NODE_ENV !== "test" && console.log("✅ Results created");

  process.env.NODE_ENV !== "test" && console.log("🙌 Seeding complete!");
};

/* seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  }); */

export default seed;
