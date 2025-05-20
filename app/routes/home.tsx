import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Colourdle!" },
    { name: "Colourdle!", content: "Welcome to the NEW Colourdle!" },
  ];
}

export default function Home() {
  console.log(process.env.NODE_ENV, "<--env (home.tsx)");
  return <div>Test</div>;
}
