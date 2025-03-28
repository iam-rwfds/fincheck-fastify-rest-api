import * as awilix from "awilix";
import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "~infra/container";

type IController<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  me(request: Req, reply: Reply): unknown;
};

class UsersController implements IController {
  // #usersService: UsersService;

  // constructor(UsersService usersService) {
  //   this.#usersService = usersService;
  // }

  me(request: FastifyRequest, reply: FastifyReply): unknown {
    const { body } = request;

    return null;
  }
}

container.register({
  usersController: awilix.asClass(UsersController),
});

export { UsersController };
export type { IController as IUsersController };
