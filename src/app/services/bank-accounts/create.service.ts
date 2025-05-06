import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import { either, type Either } from "~utils/either";
import type {
  BankAccount,
  BankAccountType,
} from "../../entities/bank-account.entity";

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

type ServiceResponse = Either<unknown, BankAccount>;

type Params = {
  name: string;
  initialBalance: number;
  type: BankAccountType;
  color: string;
  userId: string;
};

class Service extends AbstractService {
  async execute(dto: Params): Promise<ServiceResponse> {
    const bankAccount = await this.bankAccountsRepository.create(dto);

    return either.right(bankAccount);
  }
}

export { Service as CreateBankAccountService };
