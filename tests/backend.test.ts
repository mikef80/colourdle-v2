import { afterAll, beforeEach } from "@jest/globals";
import prisma from "../app/db/client";
import { jest } from "@jest/globals";

import userData from "../prisma/data/test-data/users";
import gameData from "../prisma/data/test-data/games";
import resultData from "../prisma/data/test-data/results";
import seed from "../prisma/seeds/seed";
import { describe } from "node:test";
import { Prisma } from "@prisma/client";

beforeEach(() => seed({ userData, gameData, resultData }));
afterEach(async () => {
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
});
afterAll(() => prisma.$disconnect());

describe("signup function", () => {
  it("should throw an error if the email is already in use", async () => {
    // User already exists in test data
    const promise = prisma.user.create({
      data: {
        email: "john.doe@example.com",
        firstname: "John",
        lastname: "Smith",
        password: "password123",
      },
    });

    await expect(promise).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    await expect(promise).rejects.toThrow(expect.objectContaining({ code: "P2002" }));
  });
});
