import type { BaseEntity } from "./base.entity";
import type { User } from "./user.entity";

const BANK_ACCOUNT_TYPES = Object.freeze({
  CHECKING: "checking",
  INVESTMENT: "investment",
  CASH: "cash",
});

type BankAccountType =
  (typeof BANK_ACCOUNT_TYPES)[keyof typeof BANK_ACCOUNT_TYPES];

type BankAccount = {
  name: string;
  initialBalance: number;
  type: BankAccountType;
  color: string;
  userId: User;
  // transactions?: unknown[]
} & BaseEntity;

export { BANK_ACCOUNT_TYPES, type BankAccount, type BankAccountType };
