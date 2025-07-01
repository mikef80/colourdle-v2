import { signUp } from "../services/auth.server";
import { Route } from "../+types/root";
import { redirect } from "react-router";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordconfirm = formData.get("passwordconfirm") as string;

  const { error } = await signUp(email, password);
  console.log(error, "<--***AUTH ERROR***");

  if (error) {
    let formError = {
      passwordMatch: "",
      passwordLength: "",
      passwordComposition: "",
      email: "",
    };

    if (password !== passwordconfirm) {
      formError.passwordMatch = "Passwords do not match";
    }

    if (error.code === "weak_password") {
      if (error.reasons?.includes("length")) {
        formError.passwordLength = "Password is too short (minimum 12 characters).";
      } else {
        formError.passwordComposition =
          "Password must contain at least 1 lowercase character, one uppercase character, one number and one special symbol.";
      }
    } else if (error.code === "email_already_exists") {
      formError.email = "This email is already registered.";
    }

    return { formError, supabaseError: error };
  }

  return { success: true };
};
