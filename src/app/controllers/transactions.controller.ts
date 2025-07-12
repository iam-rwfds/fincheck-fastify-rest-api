import type { FastifyReply, FastifyRequest } from "fastify";
import * as v from "valibot";
import { TOKENS } from "~infra/tokens";
import { CreateTransactionSchema } from "~routes/validations/transactions/create.schema";
import type { AssertBankAccountUserRelationService } from "~services/bank-accounts/assert-bank-account-user-relation.service";
import type { CreateTransactionService } from "~services/transactions/create.service";

type IController<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  [key in "create" /* | "show" | "update" | "delete" */]: (
    req: Req,
    reply: Reply,
  ) => Promise<void>;
};

type IControllerConstructorParams = {
  [key in symbol]: CreateTransactionService &
    AssertBankAccountUserRelationService;
};

class Controller implements IController {
  #createTransactionService: CreateTransactionService;
  #assertBankAccountUserRelationService: AssertBankAccountUserRelationService;

  constructor(deps: IControllerConstructorParams) {
    this.#createTransactionService = deps[TOKENS.Transactions.Services.Create];
    this.#assertBankAccountUserRelationService =
      deps[TOKENS.BankAccounts.Services.AssertUserRelation];
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const parsedSchema = v.safeParse(CreateTransactionSchema, req.body);

    if (!parsedSchema.success) {
      return reply.code(400).send({
        message: parsedSchema.issues[0].message,
      });
    }

    const assertBankAccountResp =
      await this.#assertBankAccountUserRelationService.execute(
        parsedSchema.output.bankAccountId,
        req.user.id,
      );

    if (assertBankAccountResp.isLeft()) {
      return reply.code(assertBankAccountResp.value.statusCode).send({
        message: assertBankAccountResp.value.message,
      });
    }

    const transaction = await this.#createTransactionService.execute({
      ...parsedSchema.output,
      date: new Date(parsedSchema.output.date),
      userId: req.user.id,
    });

    return reply.code(201).send(transaction);
  }
}

export { Controller as TransactionsController };
