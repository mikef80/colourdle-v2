import { createSupabaseServerClient } from "../lib/supabase.server";

export async function getUserSession(request: Request) {
  const { supabase } = await createSupabaseServerClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log(user, "<--user (session.server.ts)");

  return { user, error };
}
