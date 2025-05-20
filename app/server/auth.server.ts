import prisma from "../db/client.server";
import { comparePassword, encryptPassword } from "../utils/passwordUtils.server";
import { commitSession, getSession } from "../utils/sessionsUtils.server";

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
  if (!email || !firstname || !lastname || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
        headers: { "content-type": "application/json" },
      });
    }

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
  } catch (error) {
    return new Response(JSON.stringify({ error: `Signup error: ${error}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

const login = async ({ email, password }: LoginData) => {
  try {
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
  } catch (error) {
    return new Response(JSON.stringify({ error: `Login error: ${error}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

export { signup, login };
