import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import { type Either, either } from "~utils/either";
import type { BankAccount } from "../../entities/bank-account.entity";

type IServiceConstructorParams = {
  [key in symbol]: BankAccountRepository;
};

type Params = Omit<BankAccount, "$id" | "id" | "userId"> & {
  id: BankAccount["$id"];
  userId: BankAccount["userId"];
};

type ServiceResponse = Either<never, BankAccount>;

abstract class AbstractService {
  #bankAccountsRepository: BankAccountRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#bankAccountsRepository = deps[TOKENS.BankAccounts.Repository];
  }

  get bankAccountsRepository() {
    return this.#bankAccountsRepository;
  }

  abstract execute(dto: Params): Promise<ServiceResponse>;
}

class Service extends AbstractService {
  async execute(dto: Params): Promise<ServiceResponse> {
    const { id: $id, ...restBankAccount } = dto;

    const bankAccount = await this.bankAccountsRepository.update({
      id: $id,
      $id,
      ...restBankAccount,
    });

    return either.right(bankAccount);
  }
}

export { Service as UpdateBankAccountService };
