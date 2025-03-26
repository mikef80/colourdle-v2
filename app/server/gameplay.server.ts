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
const checkGuess = async (rgbGuess: number[], hexGuess: string) => {
  return { rgb: [], hex: [] };
};
// export functions
export { generateDailyColour, checkGuess, AnswerType };
