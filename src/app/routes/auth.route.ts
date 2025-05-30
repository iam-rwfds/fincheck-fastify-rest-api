import type { AuthProvider } from "~controllers/AuthProvider";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import { BaseRouteSet } from "./baseRoute";

const authRoutes = new BaseRouteSet("auth");

authRoutes.add({
  handler: (req, reply) => {
    const authProvider = container.resolve<AuthProvider>(TOKENS.Auth.Provider);

    return authProvider.signin(req, reply);
  },
  method: "POST",
  url: "/signin",
});

authRoutes.add({
  handler: (req, reply) => {
    const authProvider = container.resolve<AuthProvider>(TOKENS.Auth.Provider);

    return authProvider.signup(req, reply);
  },
  method: "POST",
  url: "/signup",
});

export { authRoutes };
