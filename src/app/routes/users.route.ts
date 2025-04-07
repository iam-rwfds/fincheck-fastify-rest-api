import type { UsersController } from "~controllers/UsersController";
import { TOKENS } from "~infra/tokens";
import { container } from "../../infra/container";
import { BaseRouteSet } from "./baseRoute";

const usersRoute = new BaseRouteSet("users");

usersRoute.add({
  handler: (req, reply) => {
    const usersController = container.resolve<UsersController>(
      TOKENS.Users.Controller,
    );

    return usersController.me(req, reply);
  },
  onRequest: (req, reply) => req.server.authenticate(req, reply),
  method: "GET",
  url: "/me",
});

export { usersRoute };
