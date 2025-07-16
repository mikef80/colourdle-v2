import { getUserSession } from "~/utils/session.server";
import { createSupabaseServerClient, supabaseSession } from "../lib/supabase.server";
import { redirect } from "react-router";

export const loader = async ({ request }: { request: Request }) => {
  const { user } = await getUserSession(request);
  if (!user) return;

  const { supabase } = await createSupabaseServerClient(request);
  await supabase.auth.signOut();

  const headers = new Headers();
  headers.append("Set-Cookie", await supabaseSession.serialize("", { maxAge: 0 }));

  return redirect("/login", { headers });
};
