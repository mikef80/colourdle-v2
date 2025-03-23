// The purpose of this file is to provide a set of utility functions for managing gameplay.

import { generateRandomRGB, rgbToHex } from "../utils/colourUtils.server";
import prisma from "../db/client";

interface GuessResponse {
  rgb: string[][];
  hex: string[];
}

type AnswerType = {
  rgb: [number, number, number];
  hex: string;
};

// generate daily colour
const generateDailyColour = async () => {
  const rgb = generateRandomRGB();
  const hex = rgbToHex(rgb);

  await prisma.game.create({
    data: {
      gameDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      answer: {
        rgb,
        hex,
      },
    },
  });
};

// check guess
const checkGuess = async (rgbGuess: number[], hexGuess: string): Promise<GuessResponse> => {
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const currentResult = await prisma.game.findUnique({ where: { gameDate: currentDate } });

  // console.log(currentResult, "<--currentResult");

  if (!currentResult) throw new Error("No game data for given date");

  const { rgb: originalRGB } = currentResult.answer as AnswerType;
  console.log(originalRGB, "<--originalRGB");
  console.log(rgbGuess, "<--rgbGuess");

  // Count totals of digits in answer
  const digitCount: Record<string, number> = {};
  for (const value of originalRGB) {
    const digits = value.toString().split("");
    // console.log(digits, "<--digits");
    for (const digit of digits) {
      digitCount[digit] = (digitCount[digit] || 0) + 1;
    }
  }


  // copy of digit count to decerement as I go
  const trackingDigitCount = { ...digitCount };

  // setup - create results array and input placeholders
  const resultsArray: any = [];
  originalRGB.forEach((number) => {
    resultsArray.push(new Array(number.toString().length).fill("invalid"));
  });
  // first check all correct digits and decrement counts
  originalRGB.forEach((number, i) => {
    const numberSplit = number
      .toString()
      .split("")
      .map((n) => Number(n));
    const guessNumberSplit = rgbGuess[i]
      .toString()
      .split("")
      .map((n) => Number(n));

    console.log(`
      ---------------------------\n
      ${i + ": " + numberSplit}\n
      ${i + ": " + guessNumberSplit}\n
      ---------------------------\n
      `);

    guessNumberSplit.forEach((n, j) => {
      if (numberSplit[j] === guessNumberSplit[j]) {
        trackingDigitCount[numberSplit[j]] -= 1;
        resultsArray[i][j] = "correct";
      }
    });
  });
  // then check for valid numbers and decrement counts
  // mark all others as invalid

  console.log(resultsArray, "<--resultsArray");
  console.log(digitCount, "<--digitCount");
  console.log(trackingDigitCount, "<--trackingDigitCount");

  return {
    rgb: resultsArray,
    hex: [],
  };
};
// export functions
export { generateDailyColour, checkGuess, AnswerType };
