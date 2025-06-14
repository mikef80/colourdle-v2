import { GameStatus } from "@prisma/client";

export type ResultSeedEntry = {
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
  guesses: number[][];
};

const resultData:ResultSeedEntry[] = [
  {
    status: GameStatus.W,
    createdAt: new Date("2025-02-01T00:10:00.000Z"),
    updatedAt: new Date("2025-02-01T00:15:00.000Z"),
    guesses: [[255, 0, 0]],
  },
  {
    status: GameStatus.L,
    createdAt: new Date("2025-02-02T00:20:00.000Z"),
    updatedAt: new Date("2025-02-02T00:25:00.000Z"),
    guesses: [
      [255, 0, 0],
      [0, 0, 255],
      [255, 192, 203],
      [173, 216, 230],
      [255, 255, 0],
      [0, 255, 255],
    ],
  },
  {
    status: GameStatus.W,
    createdAt: new Date("2025-02-03T00:05:00.000Z"),
    updatedAt: new Date("2025-02-03T00:08:00.000Z"),
    guesses: [
      [255, 255, 0],
      [0, 0, 255],
    ],
  },
  {
    status: GameStatus.A,
    createdAt: new Date("2025-02-04T00:30:00.000Z"),
    updatedAt: new Date("2025-02-04T00:45:00.000Z"),
    guesses: [
      [255, 255, 255],
      [128, 0, 0],
      [0, 255, 255],
    ],
  },
  {
    status: GameStatus.L,
    createdAt: new Date("2025-02-05T00:12:00.000Z"),
    updatedAt: new Date("2025-02-05T00:18:00.000Z"),
    guesses: [
      [255, 255, 255],
      [0, 0, 255],
      [255, 0, 0],
      [173, 216, 230],
      [255, 255, 0],
      [0, 255, 255],
    ],
  },
  {
    status: GameStatus.W,
    createdAt: new Date("2025-02-06T00:07:00.000Z"),
    updatedAt: new Date("2025-02-06T00:11:00.000Z"),
    guesses: [
      [0, 255, 255],
      [75, 0, 130],
    ],
  },
  {
    status: GameStatus.W,
    createdAt: new Date("2025-02-07T00:14:00.000Z"),
    updatedAt: new Date("2025-02-07T00:19:00.000Z"),
    guesses: [
      [255, 255, 255],
      [255, 192, 203],
    ],
  },
  {
    status: GameStatus.L,
    createdAt: new Date("2025-02-08T00:21:00.000Z"),
    updatedAt: new Date("2025-02-08T00:28:00.000Z"),
    guesses: [
      [255, 255, 255],
      [0, 255, 255],
      [255, 0, 255],
      [173, 216, 230],
      [255, 255, 0],
      [0, 255, 255],
    ],
  },
  {
    status: GameStatus.W,
    createdAt: new Date("2025-02-09T00:10:00.000Z"),
    updatedAt: new Date("2025-02-09T00:12:00.000Z"),
    guesses: [[173, 216, 230]],
  },
  {
    status: GameStatus.A,
    createdAt: new Date("2025-02-10T00:05:00.000Z"),
    updatedAt: new Date("2025-02-10T00:09:00.000Z"),
    guesses: [
      [255, 255, 255],
      [255, 255, 0],
      [0, 255, 255],
    ],
  },
];

export default resultData;
