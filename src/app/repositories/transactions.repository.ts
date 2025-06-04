import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { TOKENS } from "~infra/tokens";
import type { Transaction } from "../entities/transaction.entity";

type IRepositoryConstructorParams = {
  [key in symbol]: AppWriteSdk.Databases;
};

type IRepositoryCreateParams = Pick<
  Transaction,
  "date" | "name" | "type" | "value"
> & {
  [key in `${"user" | "bankAccount" | "category"}Id`]: string;
};

abstract class AbstractRepository {
  #databases: AppWriteSdk.Databases;

  constructor(deps: IRepositoryConstructorParams) {
    this.#databases = deps[TOKENS.Database];
  }

  get databases() {
    return this.#databases;
  }

  abstract create(dto: IRepositoryCreateParams): Promise<Transaction>;
}

class Repository extends AbstractRepository {
  async create(_dto: IRepositoryCreateParams): Promise<Transaction> {
    const transactionDocument = await this.databases.createDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.transactionsId,
      AppWriteSdk.ID.unique(),
      {
        ..._dto,
      },
    );

    const transaction: Transaction = {
      $id: transactionDocument.$id,
      date: transactionDocument.date,
      name: transactionDocument.name,
      type: transactionDocument.type,
      value: transactionDocument.value,
    };

    return transaction;
  }
}

export { Repository as TransactionsRepository };
