import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";

type IServiceConstructorParams = {
  [key in symbol]: BankAccountRepository;
};

abstract class AbstractService {
  #bankAccountsRepository: BankAccountRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#bankAccountsRepository = deps[TOKENS.BankAccounts.Repository];
  }

  get bankAccountsRepository() {
    return this.#bankAccountsRepository;
  }

  abstract execute(id: string): Promise<void>;
}

class Service extends AbstractService {
  async execute(id: string): Promise<void> {
    await this.bankAccountsRepository.remove(id);
  }
}

export { Service as DeleteBankAccountService };
