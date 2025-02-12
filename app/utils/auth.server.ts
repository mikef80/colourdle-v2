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

  if (existingUser) throw new Error("Email already in use");

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
  return new Response(null, {
    status: 302,
    headers: new Headers({
      Location: "/",
      "set-cookie": await commitSession(session),
      "content-type": "text/plain;charset=UTF-8",
    }),
  });
};

export { signup };
