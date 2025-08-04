import type { BaseEntity } from "./base.entity";

const BANK_ACCOUNT_TYPES = Object.freeze({
  CHECKING: "checking",
  INVESTMENT: "investment",
  CASH: "cash",
});

type BankAccountType =
  (typeof BANK_ACCOUNT_TYPES)[keyof typeof BANK_ACCOUNT_TYPES];

type BankAccount = {
  id: string;
  name: string;
  initialBalance: number;
  type: BankAccountType;
  color: string;
  userId: string;
} & BaseEntity;

export { BANK_ACCOUNT_TYPES, type BankAccount, type BankAccountType };
