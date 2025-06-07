import { signUp } from "../services/auth.server";
import { Route } from "../+types/root";
import { redirect } from "react-router";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await signUp(email, password);

  if (error) {
    return { error: error.message };
  }

  return redirect("/confirm-email");
};
