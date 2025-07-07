import { login } from "../services/auth.server";
import { Route } from "../+types/root";
import { redirect } from "react-router";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const {
    data: { session, user },
    error,
  } = await login(email, password);

  if (error || !user || !session) {
    throw new Response(JSON.stringify({ error: error?.message }), {
      status: error?.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return redirect("/");
};
