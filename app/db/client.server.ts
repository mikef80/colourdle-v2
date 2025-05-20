/*import dotenv from "dotenv";
dotenv.config();

 import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseURL || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing");
}

export const supabase = createClient(supabaseURL, supabaseAnonKey); */


// THIS IS MY DEFAULT PRISMA SETUP

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

/* 
// HOW TO USE PRISMA IN LOADERS

import { prisma } from "~/db/client";

export const loader = async () => {
  const users = await prisma.user.findMany();
  return { users };
};
 */
