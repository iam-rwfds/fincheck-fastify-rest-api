import { TOKENS } from "~infra/tokens";
import type { TransactionsRepository } from "~repositories/transactions.repository";
import type { Transaction } from "../../entities/transaction.entity";

type IServiceConstructorParams = {
  [key in symbol]: TransactionsRepository;
};

abstract class AbstractService {
  #bankAccountsRepository: TransactionsRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#bankAccountsRepository = deps[TOKENS.Transactions.Repository];
  }

  get bankAccountsRepository() {
    return this.#bankAccountsRepository;
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
      [key in `${"user" | "bankAccount" | "category"}Id`]: string;
    },
  ): Promise<Transaction> {
    return await this.bankAccountsRepository.create(dto);
  }
}

export { Service as CreateTransactionService };
