import { stat } from "fs";
import prisma from "../db/client";
import { comparePassword, encryptPassword } from "./passwordUtils.server";
import { commitSession, getSession } from "./sessions.server";

interface SignupData {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const signup = async ({ email, firstname, lastname, password }: SignupData) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser)
    return new Response(JSON.stringify({ error: "Email already in use" }), {
      status: 400,
      headers: { "content-type": "application/json" },
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

const login = async ({ email, password }: LoginData) => {
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password are required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const match = await comparePassword(password, user.password);

  if (!match) {
    return new Response(JSON.stringify({ error: "Incorrect password" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
};

export { signup, login };
