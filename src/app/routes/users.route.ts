import { container } from "../../infra/container";
import type { UsersController } from "../controllers/UsersController";
import { BaseRouteSet } from "./baseRoute";

const usersRoute = new BaseRouteSet("users");

usersRoute.add({
  handler: (req, reply) => {
    const usersController = container.resolve<UsersController>("usersController");

   return usersController.me(req, reply);
  },
  method: "GET",
  url: "/me",
});

export { usersRoute };
