import { authTokens } from "./auth.tokens";
import { usersTokens } from "./users.tokens";

const TOKENS = Object.freeze({
  Auth: authTokens,
  Database: Symbol.for("Database"),
  Users: usersTokens,
});

export { TOKENS };
