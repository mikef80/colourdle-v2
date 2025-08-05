import { ProtectedRoute } from "~/components/ProtectedRoute/ProtectedRoute";

const protectedroute = () => {
  return (
    <ProtectedRoute>
      <div>protectedroute</div>
    </ProtectedRoute>
  );
};

export default protectedroute;
