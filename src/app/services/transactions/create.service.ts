import { TOKENS } from "~infra/tokens";
import type { TransactionsRepository } from "~repositories/transactions.repository";

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
}
