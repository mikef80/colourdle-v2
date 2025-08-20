import { checkForDailyColour, generateDailyColour } from "~/services/gameplay.server";
import type { Route } from "./+types/home";
import { useEffect, useLayoutEffect, useState } from "react";
import gameData from "prisma/data/test-data/games";
import { useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Colourdle!" },
    { name: "Colourdle!", content: "Welcome to the NEW Colourdle!" },
  ];
}

export const loader = async () => {
  const gameExists = await checkForDailyColour();
  if (!gameExists) await generateDailyColour();

  const game = await checkForDailyColour();
  return game;
};

export default function Home() {
  /* const [navbarHeight, setNavbarHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const navbar = document.querySelector<HTMLElement>("nav");
    if (!navbar) return;

    setNavbarHeight(navbar.offsetHeight);

    if (navbar) {
      const handleTransitionEnd = () => {
        setNavbarHeight(navbar.offsetHeight);
      };
      navbar.addEventListener("transitionend", handleTransitionEnd);

      return () => navbar.removeEventListener("transitionend", handleTransitionEnd);
    }
  }, []); */

  const game = useLoaderData();

  return (
    <>
      <p>game: {JSON.stringify(game, null, 2)}</p>
      {/* <main style={{ position: "absolute", bottom: 0 }}>height: {navbarHeight}</main> */}
    </>
  );
}
