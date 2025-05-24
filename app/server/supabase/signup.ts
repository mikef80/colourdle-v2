import { supabase } from "./supabaseClient.ts";

async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Signup failed:", error.message);
    return;
  }

  console.log("Signup successful:", data);
}


signUpNewUser('mpfrancis+test1@gmail.com','987654321');