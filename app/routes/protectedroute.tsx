import { ProtectedRoute } from "~/components/ProtectedRoute/ProtectedRoute";

const protectedroute = () => {
  console.log("protected route");
  return (
    <ProtectedRoute>
      <div>protectedroute</div>
    </ProtectedRoute>
  );
};

export default protectedroute;
