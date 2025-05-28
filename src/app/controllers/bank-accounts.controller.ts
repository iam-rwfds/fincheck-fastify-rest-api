import type { FastifyReply, FastifyRequest } from "fastify";
import * as v from "valibot";
import { TOKENS } from "~infra/tokens";
import { CreateBankAccountSchema } from "~routes/validations/bank-accounts/create.schema";
import { UpdateBankAccountSchema } from "~routes/validations/bank-accounts/update.schema";
import type { AssertBankAccountUserRelationService } from "~services/bank-accounts/assert-bank-account-user-relation.service";
import type { CreateBankAccountService } from "~services/bank-accounts/create.service";
import type { GetAllBankAccountsFromUserService } from "~services/bank-accounts/get-all-from-user.service";
import type { UpdateBankAccountService } from "~services/bank-accounts/update.service";

type IController<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  [key in "create" | "show" | "update"]: (
    req: Req,
    reply: Reply,
  ) => Promise<void>;
};

type IControllerConstructorParams = {
  [key in symbol]: CreateBankAccountService &
    UpdateBankAccountService &
    AssertBankAccountUserRelationService &
    GetAllBankAccountsFromUserService;
};

class Controller implements IController {
  #createBankAccountService: CreateBankAccountService;
  #updateBankAccountService: UpdateBankAccountService;
  #assertBankAccountUserRelationService: AssertBankAccountUserRelationService;
  #getAllBankAccountsFromUserService: GetAllBankAccountsFromUserService;

  constructor(deps: IControllerConstructorParams) {
    this.#createBankAccountService = deps[TOKENS.BankAccounts.Services.Create];
    this.#updateBankAccountService = deps[TOKENS.BankAccounts.Services.Update];
    this.#assertBankAccountUserRelationService =
      deps[TOKENS.BankAccounts.Services.AssertUserRelation];

    this.#getAllBankAccountsFromUserService =
      deps[TOKENS.BankAccounts.Services.GetAllFromUser];
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
      ? reply.code(201).send(bankAccount.value)
      : reply.code(400).send({
          message: "Erro ao criar conta bancária.",
        });
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    if (
      !(typeof req.body === "object") ||
      !req.params ||
      !(typeof req.params === "object") ||
      !("id" in req.params)
    ) {
      reply.code(400).send({
        message: "Corpo de requisição inválido.",
      });

      return;
    }

    const parsedSchema = v.safeParse(UpdateBankAccountSchema, {
      ...req.body,
      id: req.params?.id,
    });

    if (!parsedSchema.success) {
      return reply.code(400).send({
        message: parsedSchema.issues[0].message,
      });
    }

    const assertBankAccountResp =
      await this.#assertBankAccountUserRelationService.execute(
        parsedSchema.output.id,
        req.user.id,
      );

    if (assertBankAccountResp.isLeft()) {
      return reply.code(assertBankAccountResp.value.statusCode).send({
        message: assertBankAccountResp.value.message,
      });
    }

    const bankAccountResp = await this.#updateBankAccountService.execute({
      ...parsedSchema.output,
      userId: req.user.id,
    });

    bankAccountResp.isRight() && reply.code(200).send(bankAccountResp.value);
  }

  async show(req: FastifyRequest, reply: FastifyReply) {
    const bankAccounts = await this.#getAllBankAccountsFromUserService.execute(
      req.user.id,
    );

    reply.code(200).send(bankAccounts.value);
  }
}

export { Controller as BankAccountsController };
