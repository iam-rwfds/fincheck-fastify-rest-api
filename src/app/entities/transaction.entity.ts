import type { BaseEntity } from "./base.entity";

type TransactionType = "income" | "expense";

type Transaction = {
  type: TransactionType;
  date: Date;
  value: number;
  name: string;
} & BaseEntity;

export type { Transaction, TransactionType };
