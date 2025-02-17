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

const URL = "http://localhost:5173/";

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

  it("should create the new user if the email is not in use", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await signup(newUser);

    const user = await prisma.user.findUnique({ where: { email: newUser.email } });

    expect(user!.email).toMatch(newUser.email);
    expect(user!.firstname).toMatch(newUser.firstname);
    expect(user!.lastname).toMatch(newUser.lastname);
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

    const match = await bcrypt.compare(newUser.password, user!.password);

    expect(match).toBe(true);
  });

  it("should return a session token on successful signup", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    const response = await signup(newUser);

    expect(response!.status).toBe(302);
    expect(response!.headers.get("set-cookie")).toBeDefined();
  });

  it("should redirect to the home page on successful signup", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    const response = await signup(newUser);

    expect(response!.headers.get("Location")).toBe("/");
  });

  it("should return a 201 successful signup when sending signup data to backend route", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    const response = await request(URL).post("/api/signup").send(newUser);

    expect(response.status).toBe(201);
    // expect(response.body.message).toBe("User created");
  });
});
