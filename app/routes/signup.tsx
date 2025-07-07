import { signUp } from "../services/auth.server";
import { Route } from "../+types/root";
import { redirect } from "react-router";
import { ExtendedAuthError } from "~/utils/types";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordconfirm = formData.get("passwordconfirm") as string;

  const { error } = await signUp(email, password);
  const typedError = error as ExtendedAuthError;
  

  if (typedError) {
    let formError = {
      passwordMatch: "",
      passwordLength: "",
      passwordComposition: "",
      genericError: "",
    };

    if (password !== passwordconfirm) {
      formError.passwordMatch = "Passwords do not match";
    }

    if (typedError.code === "weak_password") {
      if (typedError.reasons?.includes("length")) {
        formError.passwordLength = "Password is too short (minimum 12 characters).";
      }

      if (typedError.reasons?.includes("characters")) {
        formError.passwordComposition =
          "Password must contain at least 1 lowercase character, 1 uppercase character, 1 number and 1 special symbol (!@#$%^&*()_+-=[]{};\\'\\:\"|<>?,./`~.)";
      }
    } else {
      formError.genericError =
        "There was a problem with your signup. Please check your details and try again";
    }

    return { formError, supabaseError: typedError };
  }

  return { success: true, status: 201 };
};
