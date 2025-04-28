import type { BaseEntity } from "./base.entity";

const BANK_ACCOUNT_TYPES = Object.freeze({
  CHECKING: "CHECKING",
  INVESTMENT: "INVESTMENT",
  CASH: "CASH",
});

type BankAccountType =
  (typeof BANK_ACCOUNT_TYPES)[keyof typeof BANK_ACCOUNT_TYPES];

type BankAccount = {
  name: string;
  initialBalance: number;
  type: BankAccountType;
  color: string;
  userId: string;
  // transactions?: unknown[]
} & BaseEntity;

export { BANK_ACCOUNT_TYPES, type BankAccount, type BankAccountType };
