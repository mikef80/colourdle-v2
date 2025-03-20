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

  console.log(currentResult, "<--currentResult");

  if (!currentResult) throw new Error("No game data for given date");

  const { rgb } = currentResult.answer as AnswerType;

  const rgbResponse = rgb.map((originalValue, index) => {
    console.log(originalValue, "///", index, "///", rgbGuess[index]);
    const guessValueString = rgbGuess[index].toString();
    const originalValueString = originalValue.toString();

    // Count occurrences of each digit in the original value
    const digitCounts: Record<string, number> = {};
    for (const digit of originalValueString) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    }
    console.log(digitCounts, "<--dc");
  });

  return {
    rgb: [
      new Array(rgbGuess[0].toString().length).fill("correct"),
      new Array(rgbGuess[1].toString().length).fill("correct"),
      new Array(rgbGuess[2].toString().length).fill("correct"),
    ],
    hex: [],
  };
};
// export functions
export { generateDailyColour, checkGuess, AnswerType };
