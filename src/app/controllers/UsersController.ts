import type { FastifyReply, FastifyRequest } from "fastify";
import { TOKENS } from "~infra/tokens";
import type { UsersMeService } from "../services/users/me.service";

type IController<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  me(request: Req, reply: Reply): Promise<void>;
};

type IUsersControllerConstructorParams = {
  [key in symbol]: UsersMeService;
};

class UsersController implements IController {
  #usersMeService: UsersMeService;

  constructor(deps: IUsersControllerConstructorParams) {
    this.#usersMeService = deps[TOKENS.Users.Services.Me];
  }

  async me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = await this.#usersMeService.execute(request.user.id);

    user.isRight()
      ? reply.code(200).send(user.value)
      : reply.code(user.value.statusCode).send({
          message: user.value.message,
        });
  }
}

export { UsersController };
export type { IController as IUsersController };
