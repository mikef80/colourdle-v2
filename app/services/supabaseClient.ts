/* // supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
 */

/* import { supabase } from "./supabaseClient.ts";

async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) {
    console.error("Signup failed:", error.message);
    return;
  }
  
  console.log("Signup successful:", data);
  }
  
  
  signUpNewUser('mpfrancis+test1@gmail.com','987654321'); */

// supabase browser client
/* import { createBrowserClient } from "@supabase/ssr";
import dotenv from "dotenv";
import { useLoaderData } from "react-router";
dotenv.config({ path: ".env.dev" });

export const loader = () => {
  return {
    env: {
      SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
    },
  };
};

export const server = () => {
  const {env} = useLoaderData();
  return createBrowserClient(env.PUBLIC_SUPABASE_URL,env.PUBLIC_SUPABASE_ANON_KEY);
};
 */