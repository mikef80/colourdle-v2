// The purpose of this file is to provide a set of utility functions for managing gameplay.

import { generateRandomRGB, prepRGBStructures, rgbToHex } from "../utils/colourUtils.server";
import prisma from "../db/client";

type GuessAnswerType = [number, number, number];

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
  console.log(answerFrequency);

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
export { generateDailyColour, checkGuess, GuessAnswerType };
