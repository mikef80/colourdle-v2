import { signup } from "~/utils/auth.server";

export const action = async ({ request }: { request: Request }) => {
  const body = await request.json();
  const { email, firstname, lastname, password } = body;

  console.log(`
    email: ${email}
    firstname: ${firstname}
    lastname: ${lastname}
    password: ${password}
    `);

  return new Response(null, { status: 201 });
};
