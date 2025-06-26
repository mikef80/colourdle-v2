import { signUp } from "../services/auth.server";
import { Route } from "../+types/root";
import { redirect } from "react-router";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await signUp(email, password);
  console.log(error, "<--***AUTH ERROR***");

  /* if (error)
    throw new Response(JSON.stringify({ error: error?.message }), {
      status: error?.status,
      headers: { "Content-Type": "application/json" },
    }); */

  if (error) {
    let formError = "An unknown error occurred.";

    if (error.code === "weak_password") {
      if (error.reasons?.includes("length")) {
        formError = "Password is too short (minimum 6 characters).";
      } else {
        formError = "Password does not meet the security requirements.";
      }
    } else if (error.code === "email_already_exists") {
      formError = "This email is already registered.";
    }

    return { formError, supabaseError: error };
  }

  return { success: true };
};
