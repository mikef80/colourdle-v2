import { createClient } from "@supabase/supabase-js";
import { env } from "../utils/env.server";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const getAllUsers = async () => {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Failed to get all users", error);
  }

  return users;
};

const getAllUserIds = async () => {
  const users = await getAllUsers();
  const allIds = users.map((user) => user.id);
  const uniqueIds = [...new Set(allIds)];
  return uniqueIds;
};

export const deleteUsers = async () => {
  const uniqueIds = await getAllUserIds();
  const dataArray = [];

  for (let i = 0; i < uniqueIds.length; i++) {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(uniqueIds[i]);
    if (error) {
      console.error("Failed to delete user", error);
    }
    dataArray.push(data);
  }
  return dataArray;
};

getAllUsers();
