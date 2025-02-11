import { afterAll, beforeEach } from "@jest/globals";
import prisma from "../app/db/client";
import { jest } from "@jest/globals";
import userData from "../prisma/data/test-data/users";
import gameData from "../prisma/data/test-data/games";
import resultData from "../prisma/data/test-data/results";
import seed from "../prisma/seeds/seed";
import { describe } from "node:test";
import { signup } from "../app/utils/auth.server";
import bcrypt from "bcrypt";

beforeEach(() => seed({ userData, gameData, resultData }));
afterEach(async () => {
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
});
afterAll(() => prisma.$disconnect());

describe("signup function", async () => {
  it("should throw an error if the email is already in use", async () => {
    const promise = signup({
      email: "john.doe@example.com",
      firstname: "John",
      lastname: "Smith",
      password: "password123",
    });

    await expect(promise).rejects.toThrow("Email already in use");
  });

  it("should return the new user if the email is not in use", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    const result = await signup(newUser);

    expect(result.email).toMatch(newUser.email);
    expect(result.firstname).toMatch(newUser.firstname);
    expect(result.lastname).toMatch(newUser.lastname);
    expect(bcrypt.compare(newUser.password, result.password)).toBeTruthy();
  });
});
