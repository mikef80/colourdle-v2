import { login } from "../services/auth.server";
import { Route } from "../+types/root";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "../lib/supabase.server";

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

  console.log(session, "<--session");

  const { supabase, getSetCookieHeader } = await createSupabaseServerClient(request);

  // simulate a call that triggers setAll() internally
  await supabase.auth.setSession(session);

  const cookie = getSetCookieHeader();
  const headers = new Headers();
  if (cookie) {
    headers.append("Set-Cookie", cookie);
  }

  return redirect("/", { headers });
};
