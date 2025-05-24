// supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
