import type { AuthProvider } from "~controllers/AuthProvider";
import { container } from "~infra/container";
import { BaseRouteSet } from "./baseRoute";

const authRoutes = new BaseRouteSet("auth");

authRoutes.add({
  handler: (req, reply) => {
    const authProvider = container.resolve<AuthProvider>("authProvider");

    return authProvider.signin(req, reply);
  },
  method: "POST",
  url: "/signin",
});

authRoutes.add({
  handler: (req, reply) => {
    const authProvider = container.resolve<AuthProvider>("authProvider");

    return authProvider.signup(req, reply);
  },
  method: "POST",
  url: "/signup",
});

export { authRoutes };
