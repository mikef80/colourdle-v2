import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Colourdle!" },
    { name: "Colourdle!", content: "Welcome to the NEW Colourdle!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const data = { url: process.env.DATABASE_URL };
  return data;
}

export default function Home() {
  const { url } = useLoaderData<typeof loader>();

  return <div>{url}</div>;
}
