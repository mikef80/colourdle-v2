import { createClient } from "@supabase/supabase-js";
const PUBLIC_SUPABASE_URL = "https://ufsowpfzfxmpkodpnaaa.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmc293cGZ6ZnhtcGtvZHBuYWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTQ4ODcsImV4cCI6MjA2NDczMDg4N30._jXFdAck20u9fEXddzqGrPGMoci_uNt36GtZwGSLHAA";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmc293cGZ6ZnhtcGtvZHBuYWFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE1NDg4NywiZXhwIjoyMDY0NzMwODg3fQ.SBXknYoecrQ-LgyYrx_nF0bd7cx2kbc7LalUga5oNfU";

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
export const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const user = { email: "mike@mike-francis.org", password: "987654321" };

const response1 = await supabase.auth.signUp(user);
console.log(response1, ",<--response 1");
console.log("\n");

/* const {
  data: {
    user: { id },
  },
} = response1;

const response2 = await supabaseAdmin.auth.admin.updateUserById(
  String(response1.data.user.id),
  { email_confirm: true }
);

console.log(response2, ",<--response 2");
console.log("\n");

await supabase.auth.signInWithPassword(user); */

setTimeout(async () => {
  const response3 = await supabase.auth.signUp(user);
  console.log(response3, "<--response 3");
}, 60000);
