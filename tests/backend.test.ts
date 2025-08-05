import { afterAll, beforeEach, describe } from "@jest/globals";
import prisma from "../app/lib/db.server";
// import supabase from "../app/db/client.server";
import userData from "../prisma/data/test-data/users";
import gameData from "../prisma/data/test-data/games";
import resultData from "../prisma/data/test-data/results";
import seed from "../prisma/seeds/seed";
// import { login, signup } from "../app/services/auth.server";
import bcrypt from "bcrypt";

// import { comparePassword, encryptPassword } from "../app/utils/passwordUtils.server";
import {
  checkGuess,
  generateDailyColour,
  GuessAnswerType,
} from "../app/services/gameplay.server";
import * as gamePlayUtils from "../app/services/gameplay.server";
import { gameData as gameDataType } from "../prisma/seeds/seed";
import { Prisma } from "@prisma/client";
import { generateRandomRGB, hexToRgb, rgbToHex } from "../app/lib/colourUtils.server";
import { createServerClient } from "@supabase/ssr";
import { error } from "console";
/* import {
  deleteAllUsers,
  getAllUsers,
  signUp,
  supabase,
  supabaseAdmin,
} from "../app/services/auth.server"; */
// import { action as signupAction } from "../app/routes/signup";
// import { action as loginAction } from "../app/routes/login";
import { Route } from "react-router";
/* import {
  createLoginFormRequest,
  createSignupFormRequest,
} from "../app/services/helpers.server"; */

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
  jest.mock("@supabase/ssr", () => ({ createServerClient: jest.fn() }));
});

/* beforeEach(async () => {
  await deleteAllUsers();
  return seed({ userData, gameData, resultData });
});*/

afterEach(async () => {
  await prisma.result.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  jest.resetAllMocks();
});

afterAll(() => prisma.$disconnect());

describe("utils functions", () => {
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

/* describe("Supabase auth functions", () => {
  it("signUp creates a user successfully with a unique email and valid password", async () => {
    const email = "mike@mike-francis.org";
    const password = "StrongPassword123";

    const { data, error } = await signUp(email, password);

    expect(error).toBeNull();
    expect(data?.user?.email).toBe(email);
    expect(data?.user).toBeDefined();
    expect(data?.session).toBeDefined();
  });

  it("signUp return an empty identities array if user signs up with exisiting user email", async () => {
    const email = "mike@mike-francis.org";
    const password = "StrongPassword123";

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.admin.createUser({ email, password });

    if (error) throw new Error(`Error creating user: ${error.message}`);

    if (!user) throw new Error("User creation returned null user");

    const { id } = user;

    await supabaseAdmin.auth.admin.updateUserById(id, { email_confirm: true });
    const user2 = await signUp(email, password);

    expect(user.identities!.length).toBeGreaterThan(0);
    expect(user2.data.user?.identities!.length).toBe(0);
  });

  describe("/signup", () => {
    describe("POST", () => {
      it("POST:302 successfully redirects to '/confirm-user' when signing up", async () => {
        const user = { email: "mike@mike-francis.org", password: "StrongPassword123" };

        const request = createSignupFormRequest(user);

        const res = await signupAction({ request, params: {}, context: {} });

        expect(res.status).toBe(302); // redirect
        expect(res.headers.get("Location")).toBe("/confirm-email");
      });

      it("POST:400 returns an error if no password provided to signup", async () => {
        const user = { email: "mike@mike-francis.org", password: "" };

        const request = createSignupFormRequest(user);

        try {
          await signupAction({ request, params: {}, context: {} });
          throw new Error("Expected action to throw but it did not");
        } catch (res) {
          if (res instanceof Response) {
            expect(res).toBeInstanceOf(Response);
            expect(res.status).toBe(400);

            const body = await res.json();

            expect(body.error).toBe("Signup requires a valid password");
          }
        }
      });

      it("POST:422 returns an error if no email provided to signup", async () => {
        const user = { email: "", password: "StrongPassword987" };

        const request = createSignupFormRequest(user);

        try {
          await signupAction({ request, params: {}, context: {} });
          throw new Error("Expected action to throw but it did not");
        } catch (res) {
          if (res instanceof Response) {
            expect(res).toBeInstanceOf(Response);
            expect(res.status).toBe(422);

            const body = await res.json();

            expect(body.error).toBe("Anonymous sign-ins are disabled");
          }
        }
      });
    });
  });
  describe("/login", () => {
    describe("POST", () => {
      it("POST:302 successfully redirects to root when logging in", async () => {
        // Arrange
        const email = "mike@mike-francis.org";
        const password = "StrongPassword123";

        // Act
        // Sign Up
        const {
          data: { user },
          error,
        } = await signUp(email, password);

        if (error) throw new Error(`Error creating user: ${error.message}`);
        if (!user) throw new Error("User creation returned null user");

        // Confirm email address
        await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });

        // Create and send login request
        const request = createLoginFormRequest({ email, password });
        const loginRes = await loginAction({ request, params: {}, context: {} });

        // Assert
        expect(loginRes).toBeInstanceOf(Response);
        expect(loginRes.status).toBe(302);
        expect(loginRes.headers.get("Location")).toBe("/");
      });

      it("POST:400 returns an error if logging in with a non-existent user", async () => {
        // Arrange
        const email = "mike@mike-francis.org";
        const password = "StrongPassword123";
        const request = createLoginFormRequest({ email, password });

        // Act

        try {
          await loginAction({ request, params: {}, context: {} });
          throw new Error("Expected action to throw but it did not");
        } catch (res) {
          if (res instanceof Response) {
            // Assert
            expect(res).toBeInstanceOf(Response);
            expect(res.status).toBe(400);

            const body = await res.json();
            expect(body.error).toBe("Invalid login credentials");
          }
        }
      });
    });
  });
}); */
