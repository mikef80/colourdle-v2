import { afterAll, beforeEach } from "@jest/globals";
import prisma from "../app/db/client";
import userData from "../prisma/data/test-data/users";
import gameData from "../prisma/data/test-data/games";
import resultData from "../prisma/data/test-data/results";
import seed from "../prisma/seeds/seed";
import { describe } from "node:test";
import { signup } from "../app/utils/auth.server";
import bcrypt from "bcrypt";
import request from "supertest";
import { comparePassword, encryptPassword } from "../app/utils/passwordUtils.server";

const URL = "http://localhost:5173/";

beforeEach(() => seed({ userData, gameData, resultData }));

afterEach(async () => {
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(() => prisma.$disconnect());

describe("signup function", () => {
  it("should throw an error if the email is already in use", async () => {
    const response = await signup({
      email: "john.doe@example.com",
      firstname: "John",
      lastname: "Smith",
      password: "password123",
    });

    const { error } = await response.json();

    expect(error).toBe("Email already in use");
  });

  it("should create the new user if the email is not in use", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await signup(newUser);

    const user = await prisma.user.findUnique({ where: { email: newUser.email } });

    expect(user).not.toBeNull();

    if (user) {
      expect(user.email).toMatch(newUser.email);
      expect(user.firstname).toMatch(newUser.firstname);
      expect(user.lastname).toMatch(newUser.lastname);
    }
  });

  it("should hash the password before storing it", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await signup(newUser);

    const user = await prisma.user.findUnique({ where: { email: newUser.email } });

    expect(user).not.toBeNull();

    if (user) {
      const match = await bcrypt.compare(newUser.password, user.password);

      expect(match).toBe(true);
    }
  });

  it("should return a session token on successful signup", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    const response = await signup(newUser);

    expect(response.status).toBe(201);
    expect(response.headers.get("set-cookie")).toBeDefined();
  });

  it("should return a 302 successful signup when sending signup data to backend route", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    const response = await request(URL).post("/api/signup").send(newUser);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  it("should return a valid encrypted password from encryptPassword function", async () => {
    const password = "password";
    const hashedPassword = await encryptPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toMatch(/^\$2[ayb]\$.{56}$/);
    expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
  });
});

it("should return true when passing a valid password to comparePassword function", async () => {
  const password = "password";
  const hashedPassword = await encryptPassword(password);

  // expect(await comparePassword(password, hashedPassword)).toBe(true);
  expect(await comparePassword(password, hashedPassword)).toBeTrue();
});
