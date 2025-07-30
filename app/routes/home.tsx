import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { createBrowserClient } from "@supabase/ssr";
import dotenv from "dotenv";
import Topbar from "~/components/Topbar/Topbar";
import { useState } from "react";
import Login from "~/components/Login/Login";
import Signup from "~/components/Signup/Signup";
import { useMenuStore } from "~/stores/useMenuStore";
import { supabase } from "~/utils/supabase.client";
import { createClient } from "~/utils/supabase.server";
// dotenv.config({ path: ".env.dev" });
// import { server as supabase } from "~/services/supabaseClient";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Colourdle!" },
    { name: "Colourdle!", content: "Welcome to the NEW Colourdle!" },
  ];
}

export default function Home() {
  const { loginVisible, signupVisible } = useMenuStore();
  
  return (
    <>
      {loginVisible && <Login />}
      {signupVisible && <Signup />}

      <main>stuff</main>
    </>
  );
}
