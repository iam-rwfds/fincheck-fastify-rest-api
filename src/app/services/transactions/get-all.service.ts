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

  abstract execute(dto: Record<string, unknown>): Promise<Transaction[]>;
}

class Service extends AbstractService {
  async execute(dto: Record<string, unknown>): Promise<Transaction[]> {
    return await this.transactionsRepository.listAll(dto);
  }
}

export { Service as GetAllTransactionsService };
