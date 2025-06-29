import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { createBrowserClient } from "@supabase/ssr";
import dotenv from "dotenv";
import Topbar from "~/components/Topbar/Topbar";
import { useState } from "react";
import Login from "~/components/Login/Login";
import Signup from "~/components/Signup/Signup";
import { useMenuStore } from "~/stores/useMenuStore";
// dotenv.config({ path: ".env.dev" });
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
  const { loginVisible, signupVisible } = useMenuStore();
  console.log(data);

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return (
    <>
      {loginVisible && <Login />}
      {signupVisible && <Signup />}

      <main>stuff</main>
    </>
  );
}
