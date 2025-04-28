import type { FastifyReply, FastifyRequest } from "fastify";
import * as v from "valibot";
import { TOKENS } from "~infra/tokens";
import { CreateBankAccountSchema } from "~routes/validations/bank-accounts/create.schema";
import type { CreateBankAccountService } from "~services/bank-accounts/create.service";

type IController<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  create: (req: Req, reply: Reply) => Promise<void>;
};

type IControllerConstructorParams = {
  [key in symbol]: CreateBankAccountService;
};

class Controller implements IController {
  #createBankAccountService: CreateBankAccountService;

  constructor(deps: IControllerConstructorParams) {
    this.#createBankAccountService = deps[TOKENS.BankAccounts.Services.Create];
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const parsedSchema = v.safeParse(CreateBankAccountSchema, req.body);

    if (!parsedSchema.success) {
      return reply.code(400).send({
        message: parsedSchema.issues[0].message,
      });
    }
    const bankAccount = await this.#createBankAccountService.execute({
      ...parsedSchema.output,
      userId: req.user.id,
    });

    bankAccount.isRight()
      ? reply.code(200).send(bankAccount.value)
      : reply.code(400).send({
          message: "Erro ao criar conta bancária.",
        });
  }
}

export { Controller as BankAccountsController };
