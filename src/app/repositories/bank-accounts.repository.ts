import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { TOKENS } from "~infra/tokens";
import type { BankAccount } from "../entities/bank-account.entity";

type IRepository<BaseEntity extends BankAccount = BankAccount> = {
  ConstructorParams: {
    [key in symbol]: AppWriteSdk.Databases;
  };
  Create: {
    Params: [
      Omit<BaseEntity, "$id" | "id" | "userId"> & {
        userId: BaseEntity["userId"];
      },
    ];
    Response: Promise<BaseEntity>;
  };
  Update: {
    Params: [
      Omit<BaseEntity, "userId"> & {
        userId: BaseEntity["userId"];
      },
    ];
    Response: Promise<BaseEntity>;
  };
  FindOne: {
    Params: [string];
    Response: Promise<BaseEntity | null>;
  };
  GetAllFromUserById: {
    Params: [string];
    Response: Promise<
      (BaseEntity & {
        currentBalance: number;
      })[]
    >;
  };
  Remove: {
    Params: [string];
    Response: Promise<void>;
  };
};

abstract class AbstractRepository {
  #databases: AppWriteSdk.Databases;

  constructor(deps: IRepository["ConstructorParams"]) {
    this.#databases = deps[TOKENS.Database];
  }

  get databases() {
    return this.#databases;
  }

  abstract create(
    ...args: IRepository["Create"]["Params"]
  ): Promise<BankAccount>;
  abstract update(
    dto: Omit<BankAccount, "userId"> & {
      userId: BankAccount["userId"];
    },
  ): Promise<BankAccount>;
  abstract findOne(id: string): Promise<BankAccount | null>;
  abstract getAllFromUserById(userId: string): Promise<
    (BankAccount & {
      currentBalance: number;
    })[]
  >;
  abstract remove(id: string): Promise<void>;
}

class Repository extends AbstractRepository {
  async create(
    ...[dto]: IRepository["Create"]["Params"]
  ): IRepository["Create"]["Response"] {
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
      id: bankAccountDocument.$id,
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
    ...[dto]: IRepository["Update"]["Params"]
  ): IRepository["Update"]["Response"] {
    const {
      $id,
      id: _,
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
      } satisfies Omit<typeof dto, "initialBalance" | "id" | "userId"> & {
        initial_balance: (typeof dto)["initialBalance"];
        usersId: (typeof dto)["userId"];
      },
    );

    const bankAccount: BankAccount = {
      id: bankAccountDocument.$id,
      $id: bankAccountDocument.$id,
      color: bankAccountDocument.color,
      initialBalance: bankAccountDocument.initial_balance,
      name: bankAccountDocument.name,
      type: bankAccountDocument.type,
      userId: bankAccountDocument.usersId,
    };

    return bankAccount;
  }

  async findOne(
    ...[id]: IRepository["FindOne"]["Params"]
  ): IRepository["FindOne"]["Response"] {
    const bankAccountDocument = await this.databases.getDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      id,
    );

    if (!bankAccountDocument) {
      return null;
    }

    const bankAccount: BankAccount = {
      id: bankAccountDocument.$id,
      $id: bankAccountDocument.$id,
      color: bankAccountDocument.color,
      initialBalance: bankAccountDocument.initial_balance,
      name: bankAccountDocument.name,
      type: bankAccountDocument.type,
      userId: bankAccountDocument.usersId.$id,
    };

    return bankAccount;
  }

  async getAllFromUserById(
    ...[userId]: IRepository["GetAllFromUserById"]["Params"]
  ): IRepository["GetAllFromUserById"]["Response"] {
    const bankAccountsDocuments = await this.databases.listDocuments(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      [AppWriteSdk.Query.equal("usersId", userId)],
    );

    const bankAccounts: (BankAccount & {
      currentBalance: number;
    })[] = bankAccountsDocuments.documents.map((document) => {
      const totalInTransactions = document.usersId.transactionsId.reduce(
        (
          acc: number,
          transaction: {
            type: string;
            value: number;
          },
        ) => {
          return (
            acc +
            (transaction.type === "income"
              ? transaction.value
              : -transaction.value)
          );
        },
        0,
      );

      const currentBalance = document.initial_balance + totalInTransactions;

      return {
        id: document.$id,
        $id: document.$id,
        initialBalance: document.initial_balance,
        type: document.type,
        color: document.color,
        name: document.name,
        userId,
        currentBalance,
      };
    });

    return bankAccounts;
  }

  async remove(
    ...[id]: IRepository["Remove"]["Params"]
  ): IRepository["Remove"]["Response"] {
    await this.databases.deleteDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.bankAccountsId,
      id,
    );
  }
}

export { Repository as BankAccountRepository };
