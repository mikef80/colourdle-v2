import prisma from "../db/client";
import { encryptPassword } from "./passwordUtils.server";

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

  return newUser;
};

export { signup };
