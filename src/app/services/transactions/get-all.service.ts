import { TOKENS } from "~infra/tokens";
import type { TransactionsRepository } from "~repositories/transactions.repository";
import type { Transaction } from "../../entities/transaction.entity";

type IServiceConstructorParams = {
  [key in symbol]: TransactionsRepository;
};

type IService = {
  Params: {
    userId: string;
  };
  Response: Transaction[]
}

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
  async execute(dto: IService['Params']): Promise<IService['Response']> {
    return await this.transactionsRepository.listAll(dto);
  }
}

export { Service as GetAllTransactionsService };
