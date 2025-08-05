import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/utils/auth-context";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return children;
};
