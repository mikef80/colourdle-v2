import type { Route } from "./+types/home";
import { useLayoutEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Colourdle!" },
    { name: "Colourdle!", content: "Welcome to the NEW Colourdle!" },
  ];
}

export default function Home() {
  const [navbarHeight, setNavbarHeight] = useState<number | null>(null);

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
  }, []);

  return (
    <>
      <p>test</p>
      <main style={{ position: "absolute", bottom: 0 }}>height: {navbarHeight}</main>
    </>
  );
}
