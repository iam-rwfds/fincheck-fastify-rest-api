import { either, type Either } from "~utils/either";
import type { BankAccount } from "../../entities/bank-account.entity";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import { TOKENS } from "~infra/tokens";

type SResponse = Either<unknown, BankAccount[]>;

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

  abstract execute(userId: string): Promise<SResponse>;
}

class Service extends AbstractService {
  async execute(userId: string): Promise<SResponse> {
    const bankAccounts =
      await this.bankAccountsRepository.getAllFromUserById(userId);

    return either.right(bankAccounts);
  }
}

export { Service as GetAllBankAccountsFromUserService };
