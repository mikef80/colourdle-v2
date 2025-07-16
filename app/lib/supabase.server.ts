import { createServerClient } from "@supabase/ssr";
import { createCookie } from "react-router";

export const supabaseSession = createCookie("sb:session", {
  // maxAge: 7,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

export const createSupabaseServerClient = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie") ?? "";

  const existingSession = await supabaseSession.parse(cookieHeader);
  let newSessionValue = "";
  // console.log(existingSession, "exisitingSession");

  const supabase = createServerClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return existingSession ? [{ name: "sb:session", value: existingSession }] : [];
        },
        setAll: async (cookies) => {
          const headers = new Headers();
          for (const cookie of cookies) {
            console.log(cookie,'<--cookie');

            newSessionValue = await supabaseSession.serialize(cookie.value, cookie.options);
          }
        },
      },
    }
  );
  return {
    supabase,
    getSetCookieHeader: () => newSessionValue,
  };
};
