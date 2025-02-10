import prisma from "../../app/db/client.ts";
import userData from "../data/test-data/users.ts";
import gameData from "../data/test-data/games.ts";
import resultData from "../data/test-data/results.ts";

async function main() {
  // Remove existing data
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  await prisma.user.createMany({ data: userData });
  const userIds = await prisma.user.findMany({ select: { id: true } });

  // Seed Games
  await prisma.game.createMany({ data: gameData });
  const gameIds = await prisma.game.findMany({ select: { id: true, answer: true, gameDate: true } });

  // Seed Results
  const results = await resultData.map((result, index) => {
    const returnResult = {
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      guesses: result.guesses,
      userId: userIds[Math.floor(Math.random()*10)].id,
      gameId: gameIds[Math.floor(Math.random()*10)].id,
      /* userId: userIds[index].id,
      gameId: gameIds[index].id, */
    };
    // console.log(returnResult);
    
    return returnResult
  })
  

  await prisma.result.createMany({
    data: results
  })
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


// export default seed;