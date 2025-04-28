import * as AppWriteSdk from "node-appwrite";
import { TOKENS } from "~infra/tokens";
import type { BankAccount } from "../entities/bank-account.entity";
import { env } from "~config/env";

type IRepositoryConstructorParams = {
  [key in symbol]: AppWriteSdk.Databases;
};

abstract class AbstractRepository {
  #databases: AppWriteSdk.Databases;

  constructor(deps: IRepositoryConstructorParams) {
    this.#databases = deps[TOKENS.Database];
  }

  get databases() {
    return this.#databases;
  }

  abstract create(dto: Omit<BankAccount, "$id">): Promise<BankAccount>;
}

class Repository extends AbstractRepository {
  async create(dto: Omit<BankAccount, "$id">): Promise<BankAccount> {
    const bankAccountDocument = await this.databases.createDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      AppWriteSdk.ID.unique(),
      {
        ...dto,
      },
    );

    const bankAccount: BankAccount = {
      $id: bankAccountDocument.$id,
      color: bankAccountDocument.color,
      initialBalance: bankAccountDocument.initialBalance,
      name: bankAccountDocument.name,
      type: bankAccountDocument.type,
      userId: bankAccountDocument.userId,
    };

    return bankAccount;
  }
}

export { Repository as BankAccountRepository };
