import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { TOKENS } from "~infra/tokens";
import type {
  Transaction,
  TransactionType,
} from "../entities/transaction.entity";

type IRepositoryConstructorParams = {
  [key in symbol]: AppWriteSdk.Databases;
};

type IRepositoryCreateParams = Pick<
  Transaction,
  "date" | "name" | "type" | "value"
> & {
  [key in `${"user" | "bankAccount"}Id`]: string;
} & {
  categoryId?: string;
};

type IRepositoryListAllParams = {
  userId: string;
  filters: {
    month: number;
    year: number;
    bankAccountId?: string;
    type?: TransactionType;
  };
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
  abstract listAll(dto: IRepositoryListAllParams): Promise<Transaction[]>;
}

class Repository extends AbstractRepository {
  async create({
    bankAccountId: bankAccountsId,
    userId: usersId,
    ...dto
  }: IRepositoryCreateParams): Promise<Transaction> {
    const transactionDocument = await this.databases.createDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.transactionsId,
      AppWriteSdk.ID.unique(),
      {
        ...dto,
        bankAccountsId,
        usersId,
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

  async listAll(dto: IRepositoryListAllParams): Promise<Transaction[]> {
    const date = new Date();
    date.setFullYear(dto.filters.year);
    date.setMonth(dto.filters.month);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const offset = new Date(date);
    offset.setMonth(date.getMonth() + 1);

    const queries = [
      AppWriteSdk.Query.equal("usersId", dto.userId),
      AppWriteSdk.Query.greaterThanEqual("date", date.toISOString()),
      AppWriteSdk.Query.lessThan("date", offset.toISOString()),
    ];

    dto.filters.type &&
      queries.push(AppWriteSdk.Query.equal("type", dto.filters.type));

    dto.filters.bankAccountId &&
      queries.push(
        AppWriteSdk.Query.equal("bankAccountsId", dto.filters.bankAccountId),
      );

    const transactionsDocuments = await this.databases.listDocuments(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.transactionsId,
      queries,
    );

    console.log(transactionsDocuments.documents);

    const transactions: Transaction[] = transactionsDocuments.documents.map(
      (document) => ({
        $id: document.$id,
        type: document.type,
        name: document.name,
        date: document.date,
        value: document.value,
      }),
    );

    return transactions;
  }
}

export { Repository as TransactionsRepository };
