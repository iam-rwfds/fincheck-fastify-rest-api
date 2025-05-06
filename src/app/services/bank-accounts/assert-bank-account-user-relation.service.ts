import { BankAccountUserNotFoundException } from "~exceptions/bank-account/bank-account-user-not-found";
import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import { type Either, either } from "~utils/either";

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
}

type ServiceResponse = Either<BankAccountUserNotFoundException, null>;

class Service extends AbstractService {
  async execute(id: string, userId: string): Promise<ServiceResponse> {
    const bankAccount = await this.bankAccountsRepository.findOne(id);

    if (!bankAccount || bankAccount.userId !== userId) {
      return either.left(new BankAccountUserNotFoundException());
    }

    return either.right(null);
  }
}

export { Service as AssertBankAccountUserRelationService };
