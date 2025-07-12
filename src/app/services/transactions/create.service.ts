import { TOKENS } from "~infra/tokens";
import type { TransactionsRepository } from "~repositories/transactions.repository";
import type { Transaction } from "../../entities/transaction.entity";

type IServiceConstructorParams = {
  [key in symbol]: TransactionsRepository;
};

abstract class AbstractService {
  #transactionsRepository: TransactionsRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#transactionsRepository = deps[TOKENS.Transactions.Repository];
  }

  get transactionsRepository() {
    return this.#transactionsRepository;
  }

  abstract execute(
    dto: Pick<Transaction, "date" | "name" | "type" | "value"> & {
      [key in `${"user" | "bankAccount" | "category"}Id`]: string;
    },
  ): Promise<Transaction>;
}

class Service extends AbstractService {
  async execute(
    dto: Pick<Transaction, "date" | "name" | "type" | "value"> & {
      [key in `${"user" | "bankAccount"}Id`]: string;
    } & {
      categoryId?: string;
    },
  ): Promise<Transaction> {
    return await this.transactionsRepository.create(dto);
  }
}

export { Service as CreateTransactionService };
