import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";

type IServiceConstructorParams = {
  [key in symbol]: BankAccountRepository;
};

abstract class DeleteBankAccountService {
  #bankAccountsRepository: BankAccountRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#bankAccountsRepository = deps[TOKENS.BankAccounts.Repository];
  }

  get bankAccountsRepository() {
    return this.#bankAccountsRepository;
  }

  abstract execute(id: string): Promise<void>;
}

class Service extends DeleteBankAccountService {
  async execute(id: string): Promise<void> {
    await this.bankAccountsRepository.remove(id);
  }
}

export { Service as DeleteBankAccountService };
