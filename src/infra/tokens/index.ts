import { authTokens } from "./auth.tokens";
import { bankAccountsTokens } from "./bank-accounts.tokens";
import { categoriesTokens } from "./categories.tokens";
import { usersTokens } from "./users.tokens";

const TOKENS = Object.freeze({
  Auth: authTokens,
  Database: Symbol.for("Database"),
  Users: usersTokens,
  Categories: categoriesTokens,
  BankAccounts: bankAccountsTokens,
});

export { TOKENS };
