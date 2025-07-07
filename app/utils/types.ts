import type { AuthError as SupabaseAuthError } from "@supabase/supabase-js";

export interface ExtendedAuthError extends SupabaseAuthError {
  reasons?: string[];
}
