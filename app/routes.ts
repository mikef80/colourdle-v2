import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "routes/api/signup.ts"),
  route("login", "routes/api/login.ts"),
] satisfies RouteConfig;
