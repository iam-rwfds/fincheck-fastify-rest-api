import type { FastifyReply, FastifyRequest } from "fastify";
import { TOKENS } from "~infra/tokens";
import type { GetAllCategoriesFromUserService } from "~services/categories/mine.service";

type IController<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  [key in "show"]: (
    req: Req,
    reply: Reply,
  ) => Promise<void>;
};

type IControllerConstructorParams = {
  [key in symbol]: GetAllCategoriesFromUserService
}

class Controller implements IController {
  #getAllCategoriesFromUserService: GetAllCategoriesFromUserService;

  constructor(deps: IControllerConstructorParams) {
    this.#getAllCategoriesFromUserService = deps[TOKENS.Categories.Services.Mine];
  }

  async show(req: FastifyRequest, reply: FastifyReply) {
    const categories = await this.#getAllCategoriesFromUserService.execute(req.user.id);

    return reply.code(200).send(categories.value);
  }
}

export { Controller as CategoriesController }
