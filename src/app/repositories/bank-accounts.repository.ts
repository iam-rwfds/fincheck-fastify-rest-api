import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { TOKENS } from "~infra/tokens";
import type { BankAccount } from "../entities/bank-account.entity";

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

  abstract create(
    dto: Omit<BankAccount, "$id" | "userId"> & {
      userId: BankAccount["userId"];
    },
  ): Promise<BankAccount>;
  abstract update(
    dto: Omit<BankAccount, "userId"> & {
      userId: BankAccount["userId"];
    },
  ): Promise<BankAccount>;
  abstract findOne(id: string): Promise<BankAccount | null>;
  abstract getAllFromUserById(userId: string): Promise<BankAccount[]>;
}

class Repository extends AbstractRepository {
  async create(
    dto: Omit<BankAccount, "$id" | "userId"> & {
      userId: BankAccount["userId"];
    },
  ): Promise<BankAccount> {
    const { initialBalance, userId, ...data } = dto;

    const bankAccountDocument = await this.databases.createDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      AppWriteSdk.ID.unique(),
      {
        ...data,
        initial_balance: initialBalance,
        usersId: userId,
      } satisfies Omit<typeof dto, "initialBalance" | "userId"> & {
        initial_balance: (typeof dto)["initialBalance"];
        usersId: (typeof dto)["userId"];
      },
    );

    const bankAccount: BankAccount = {
      $id: bankAccountDocument.$id,
      color: bankAccountDocument.color,
      initialBalance: bankAccountDocument.initial_balance,
      name: bankAccountDocument.name,
      type: bankAccountDocument.type,
      userId: bankAccountDocument.usersId,
    };

    return bankAccount;
  }

  async update(
    dto: Omit<BankAccount, "userId"> & {
      userId: BankAccount["userId"];
    },
  ): Promise<BankAccount> {
    const {
      $id,
      userId: usersId,
      initialBalance: initial_balance,
      ...data
    } = dto;

    const bankAccountDocument = await this.databases.updateDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      $id,
      {
        ...data,
        initial_balance,
        usersId: usersId,
        $id,
      } satisfies Omit<typeof dto, "initialBalance" | "userId"> & {
        initial_balance: (typeof dto)["initialBalance"];
        usersId: (typeof dto)["userId"];
      },
    );

    const bankAccount: BankAccount = {
      $id: bankAccountDocument.$id,
      color: bankAccountDocument.color,
      initialBalance: bankAccountDocument.initial_balance,
      name: bankAccountDocument.name,
      type: bankAccountDocument.type,
      userId: bankAccountDocument.usersId,
    };

    return bankAccount;
  }

  async findOne(id: string): Promise<BankAccount | null> {
    const bankAccountDocument = await this.databases.getDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      id,
    );

    if (!bankAccountDocument) {
      return null;
    }

    const bankAccount: BankAccount = {
      $id: bankAccountDocument.$id,
      color: bankAccountDocument.color,
      initialBalance: bankAccountDocument.initial_balance,
      name: bankAccountDocument.name,
      type: bankAccountDocument.type,
      userId: bankAccountDocument.usersId.$id,
    };

    return bankAccount;
  }

  async getAllFromUserById(userId: string): Promise<BankAccount[]> {
    const bankAccountsDocuments = await this.databases.listDocuments(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      [AppWriteSdk.Query.equal("usersId", userId)],
    );

    const bankAccounts: BankAccount[] = bankAccountsDocuments.documents.map(
      (document) => ({
        $id: document.$id,
        initialBalance: document.initial_balance,
        type: document.type,
        color: document.color,
        name: document.name,
        userId,
      }),
    );

    return bankAccounts;
  }
}

export { Repository as BankAccountRepository };
