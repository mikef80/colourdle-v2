import userData from "../data/test-data/users.ts";
import gameData from "../data/test-data/games.ts";
import resultData from "../data/test-data/results.ts";
import seed from "./seed.ts";

const runSeed = () => {
  return seed({ userData, gameData, resultData });
};

runSeed();
