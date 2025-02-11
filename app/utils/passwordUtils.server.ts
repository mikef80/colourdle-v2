import bcrypt from "bcrypt";

const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export{ encryptPassword };
