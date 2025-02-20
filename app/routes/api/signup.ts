import { redirect } from "@remix-run/node";
import { signup } from "~/utils/auth.server";

export const action = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();
    const response = await signup(body);

    if (response.status === 201) {
      return redirect("/");
    }

    return response;
    
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
