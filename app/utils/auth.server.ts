import { stat } from "fs";
import prisma from "../db/client";
import { encryptPassword } from "./passwordUtils.server";
import { commitSession, getSession } from "./sessions.server";

interface SignupData {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

const signup = async ({ email, firstname, lastname, password }: SignupData) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser)
    return new Response(JSON.stringify({ error: "Email already in use" }), {
      status: 400,
      headers: { "Content-type": "application/json" },
    });

  const hashedPassword = await encryptPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      password: hashedPassword,
    },
  });

  // create a session here
  const session = await getSession();
  session.set("userId", newUser.id);

  // return the session token
  return new Response(JSON.stringify({ message: "User created" }), {
    status: 201,
    headers: {
      "set-cookie": await commitSession(session),
      "content-type": "application/json",
    },
  });
};

export { signup };
