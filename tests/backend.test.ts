import { afterAll, beforeEach, describe } from "@jest/globals";
import prisma from "../app/db/client.server";
// import supabase from "../app/db/client.server";
import userData from "../prisma/data/test-data/users";
import gameData from "../prisma/data/test-data/games";
import resultData from "../prisma/data/test-data/results";
import seed from "../prisma/seeds/seed";
import { login, signup } from "../app/server/auth.server";
import bcrypt from "bcrypt";
import request from "supertest";
import { comparePassword, encryptPassword } from "../app/utils/passwordUtils.server";
import {
  checkGuess,
  generateDailyColour,
  GuessAnswerType,
} from "../app/server/gameplay.server";
import * as gamePlayUtils from "../app/server/gameplay.server";
import { gameData as gameDataType } from "../prisma/seeds/seed";
import { Prisma } from "@prisma/client";
import { generateRandomRGB, hexToRgb, rgbToHex } from "../app/utils/colourUtils.server";

const URL = "http://localhost:5173/";

// check server is running before running tests
beforeAll(async () => {
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Backend not responding");
  } catch (err) {
    throw new Error("Backend server is not running. Start it before running tests.");
  }
  /* console.log(process.env.NODE_ENV, "<--env");
  console.log(process.env.DATABASE_URL, "<--DB"); */
});

beforeEach(() => seed({ userData, gameData, resultData }));

afterEach(async () => {
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  jest.resetAllMocks();
});

afterAll(() => prisma.$disconnect());

describe("utils functions", () => {
  it("should return a valid encrypted password from encryptPassword function", async () => {
    const password = "password";
    const hashedPassword = await encryptPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toMatch(/^\$2[ayb]\$.{56}$/);
    expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
  });

  it("should return true when passing a valid password to comparePassword function", async () => {
    const password = "password";
    const hashedPassword = await encryptPassword(password);

    expect(await comparePassword(password, hashedPassword)).toBe(true);
  });

  it("should return the correct RGB value for a given hex value using the hexToRGB function", async () => {
    const hex = "#FF0000";

    const rgb = hexToRgb(hex);

    expect(rgb).toEqual([255, 0, 0]);
  });

  it("should return a valid triplet where each value is between 0 and 255 using the generateRandomRGB function", () => {
    const RGB = generateRandomRGB();

    RGB.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(255);
    });
  });
});

/* describe("signup function", () => {
  it("should throw a 409 error if the email is already in use", async () => {
    const response = await signup({
      email: "john.doe@example.com",
      firstname: "John",
      lastname: "Smith",
      password: "password123",
    });

    const { status } = response;
    const { error } = await response.json();

    expect(status).toBe(409);
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
}); */

/* describe("login function", () => {
  it("should return an error if either email or password aren't provided", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await request(URL).post("/api/signup").send(newUser);

    const response = await login({ email: newUser.email, password: "" });
    const { error } = await response.json();

    expect(response.status).toBe(400);
    expect(error).toBe("Email and password are required");
  });

  it("should return an error if the email doesn't exist", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await request(URL).post("/api/signup").send(newUser);

    const response = await login({
      email: "davey.jones1@locker.com",
      password: newUser.password,
    });
    const { error } = await response.json();

    expect(response.status).toBe(404);
    expect(error).toBe("User not found");
  });

  it("should return an error if the password is incorrect", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await request(URL).post("/api/signup").send(newUser);

    const response = await login({ email: newUser.email, password: "password124" });
    const { error } = await response.json();

    expect(response.status).toBe(401);
    expect(error).toBe("Incorrect password");
  });

  it("should return a session token on sucessful login", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await request(URL).post("/api/signup").send(newUser);

    const response = await login({ email: newUser.email, password: newUser.password });

    expect(response.status).toBe(201);
    expect(response.headers.get("set-cookie")).toBeDefined();
  });

  it("should return a 302 successful login when sending login data to backend route", async () => {
    const newUser = {
      email: "davey.jones@locker.com",
      firstname: "Davey",
      lastname: "Jones",
      password: "password123",
    };

    await request(URL).post("/api/signup").send(newUser);

    const response = await request(URL).post("/api/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });
}); */

describe("supabase signup functions", () => {});

describe("generate daily colour function", () => {
  it("stores a new entry in the DB for the current date", async () => {
    await generateDailyColour();
    const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const result = await prisma.game.findUnique({ where: { gameDate: currentDate } });

    expect(result).not.toBeNull();

    if (result) {
      expect(result.gameDate.toISOString()).toEqual(currentDate);
    }
  });

  it("has an array containing valid rgb value stored", async () => {
    await generateDailyColour();
    const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const result = await prisma.game.findUnique({ where: { gameDate: currentDate } });

    if (result) {
      const { rgb } = result.answer as { rgb: number[]; hex: string };

      expect(rgb).not.toBeNull();

      if (rgb) {
        expect(rgb).toBeArray();
        rgb.forEach((value) => {
          expect(value).toBeNumber();
          expect(value).toBeLessThanOrEqual(255);
          expect(value).toBeGreaterThanOrEqual(0);
        });
      }
    }
  });

  it("has a string containing a valid hex value stored", async () => {
    await generateDailyColour();
    const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const result = await prisma.game.findUnique({ where: { gameDate: currentDate } });

    if (result) {
      const { hex } = result.answer as { rgb: number[]; hex: string };

      expect(typeof hex).toBe("string");
      expect(hex.length).toBe(7);

      for (let i = 1; i < 7; i++) {
        const value = parseInt(hex[i], 16);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(0xf);
      }
    }
  });

  it("only allows single value per date to be created and stored", async () => {
    await generateDailyColour();
    let dbError;

    try {
      await generateDailyColour();
    } catch (error) {
      dbError = error;
    }

    expect(dbError).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    expect((dbError as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
  });

  it("generates rgb and hex values that equate to the same colour", async () => {
    await generateDailyColour();
    const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const result = await prisma.game.findUnique({ where: { gameDate: currentDate } });

    if (result) {
      const { rgb, hex } = result.answer as { rgb: [number, number, number]; hex: string };

      const convertedRgb = hexToRgb(hex);
      const convertedHex = rgbToHex(rgb);

      expect(convertedRgb).toMatchObject(rgb);
      expect(convertedHex).toEqual(hex);
    }
  });
});

describe("check guess function", () => {
  it("takes an array as an argument", () => {
    const spy = jest.spyOn(gamePlayUtils, "checkGuess");
    const guess: GuessAnswerType = [146, 190, 234];
    const answer: GuessAnswerType = [146, 190, 234];

    gamePlayUtils.checkGuess(guess, answer);

    expect(gamePlayUtils.checkGuess).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array)
    );

    spy.mockRestore();
  });

  it("returns an object containing an rgb key key", async () => {
    const guess: GuessAnswerType = [146, 190, 234];
    const answer: GuessAnswerType = [146, 190, 234];

    const response = await checkGuess(guess, answer);

    expect(response).toBeObject();
    expect(response).toContainAllKeys(["rgb"]);
  });

  it("response provides array for the rgb key", async () => {
    const guess: GuessAnswerType = [146, 190, 234];
    const answer: GuessAnswerType = [146, 190, 234];

    const response = await checkGuess(guess, answer);

    Object.entries(response).forEach(([key, value]) => {
      expect(value).toBeArray();
    });
  });

  it('returns "correct" for correct RGB digits', async () => {
    // Arrange
    const guess: GuessAnswerType = [146, 190, 234];
    const answer: GuessAnswerType = [146, 190, 234];

    // Act
    const response = await checkGuess(guess, answer);
    const { rgb } = response;

    // Assert
    rgb.forEach((subArray) => {
      subArray.forEach((value) => expect(value).toBe("correct"));
    });
  });

  it('returns "valid" for valid RGB digits (correct digits but in wrong position)', async () => {
    // Arrange
    const guess: GuessAnswerType = [146, 190, 234];
    const answer: GuessAnswerType = [144, 196, 230];

    // Act
    const response = await checkGuess(guess, answer);
    const { rgb } = response;

    // Assert
    rgb.forEach((subArray) => {
      expect(subArray[2]).toBe("valid");
    });
  });

  it("returns 'invalid' for invalid RGB digits (don't appears in the answer or have run out of number of occurences)", async () => {
    // Arrange
    const answer: GuessAnswerType = [146, 190, 234];
    const guess: GuessAnswerType = [176, 191, 231];

    // Act
    const response = await checkGuess(guess, answer);
    const { rgb } = response;

    // Assert
    expect(rgb).toMatchObject([
      ["correct", "invalid", "correct"],
      ["correct", "correct", "invalid"],
      ["correct", "correct", "invalid"],
    ]);
  });

  it("returns a full answer with all appropriate responses", async () => {
    // Arrange
    const answer: GuessAnswerType = [146, 190, 234];
    const guess: GuessAnswerType = [98, 176, 254];

    // Act
    const response = await checkGuess(guess, answer);
    const { rgb } = response;

    // Assert
    expect(rgb).toMatchObject([
      ["valid", "invalid"],
      ["correct", "invalid", "valid"],
      ["correct", "invalid", "correct"],
    ]);
  });
});

describe("update daily play stats", () => {});
