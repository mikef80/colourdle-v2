import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { createBrowserClient } from "@supabase/ssr";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });
// import { server as supabase } from "~/services/supabaseClient";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Colourdle!" },
    { name: "Colourdle!", content: "Welcome to the NEW Colourdle!" },
  ];
}

export const loader = async () => {
  const supabase = createBrowserClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.from("User").select();

  return { data };
};

export default function Home() {
  const data = useLoaderData();
  console.log(process.env.NODE_ENV, "<--env (home.tsx)");
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
