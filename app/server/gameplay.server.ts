// The purpose of this file is to provide a set of utility functions for managing gameplay.

import prisma from "../db/client";

// generate daily colour
const generateDailyColour = async () => {
  await prisma.game.create({
    data: {
      gameDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      answer: {
        rgb: [255, 0, 0],
        hex: "#FF0000",
      },
    },
  });
};

// check guess

// export functions
export { generateDailyColour };
