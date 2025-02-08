import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

/* 
HOW TO USE PRISMA IN LOADERS

import { prisma } from "~/db/client";

export const loader = async () => {
  const users = await prisma.user.findMany();
  return { users };
};
 */