import type { RouteOptions } from "fastify";
import { BaseRouteSet } from "./baseRoute";

const authRoutes = new BaseRouteSet("auth");

authRoutes.add({
  handler: () => {},
  method: "POST",
  url: "/signin",
});

authRoutes.add({
  handler: () => {},
  method: "POST",
  url: "/signup",
});

export { authRoutes };
