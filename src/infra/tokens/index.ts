import { authTokens } from "./auth.tokens";
import { bankAccountsTokens } from "./bank-accounts.tokens";
import { categoriesTokens } from "./categories.tokens";
import { transactionsTokens } from "./transactions.tokens";
import { usersTokens } from "./users.tokens";

const TOKENS = Object.freeze({
  Auth: authTokens,
  Database: Symbol.for("Database"),
  Users: usersTokens,
  Categories: categoriesTokens,
  BankAccounts: bankAccountsTokens,
  Transactions: transactionsTokens,
});

export { TOKENS };
