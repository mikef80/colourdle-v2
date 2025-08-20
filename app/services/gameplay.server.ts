// The purpose of this file is to provide a set of utility functions for managing gameplay.

import { generateRandomRGB, prepRGBStructures, rgbToHex } from "../lib/colourUtils.server";
import prisma from "../lib/db.server";

type GuessAnswerType = [number, number, number];

// check for exisiting daily colour
const checkForDailyColour = async () => {
  // set today at 00:00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // set tomorrow at 00:00:00
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const game = await prisma.game.findFirstOrThrow({
      where: {
        gameDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    console.log("Today's game:", game);
    return game;
  } catch (error) {
    console.error("***No game found for today.***");
    return null;
  }
};

// generate daily colour
const generateDailyColour = async () => {
  const rgb = generateRandomRGB();
  const hex = rgbToHex(rgb);
  const now = new Date();
  const gameDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  console.log(gameDate, "<--***");

  await prisma.game.create({
    data: {
      gameDate,
      answer: {
        rgb,
        hex,
      },
    },
  });
};

// check guess
const checkGuess = async (
  rgbGuess: [number, number, number],
  answer: [number, number, number]
) => {
  const answerFrequency: Record<number, number> = {};

  // tally up how often each number appears in the answer
  for (const num of answer) {
    for (const digit of num.toString()) {
      const digitAsNumber = parseInt(digit, 10);
      answerFrequency[digitAsNumber] = (answerFrequency[digitAsNumber] || 0) + 1;
    }
  }

  // prep rgbGuess and answer for processing
  const rgbGuessRestructured = prepRGBStructures(rgbGuess); // [ [ 1, 4, 6 ], [ 1, 9, 0 ], [ 2, 3, 4 ] ]
  const answerRestructured = prepRGBStructures(answer);
  const rgbResponse = rgbGuessRestructured.map((array) => array.map((item) => "incorrect"));

  // First pass - check correct digits
  for (let i = 0; i < rgbGuessRestructured.length; i++) {
    for (let j = 0; j < rgbGuessRestructured[i].length; j++) {
      if (answerRestructured[i][j] === rgbGuessRestructured[i][j]) {
        rgbResponse[i][j] = "correct";
        answerFrequency[answerRestructured[i][j]]--;
      }
    }
  }

  // Second pass - check for valid digits
  for (let i = 0; i < rgbGuessRestructured.length; i++) {
    for (let j = 0; j < rgbGuessRestructured[i].length; j++) {
      if (rgbResponse[i][j] !== "correct") {
        if (answerFrequency[rgbGuessRestructured[i][j]] > 0) {
          rgbResponse[i][j] = "valid";
          answerFrequency[rgbGuessRestructured[i][j]]--;
        } else {
          rgbResponse[i][j] = "invalid";
        }
      }
    }
  }

  return {
    rgb: rgbResponse,
  };
};
// export functions
export { generateDailyColour, checkGuess, checkForDailyColour, GuessAnswerType };
