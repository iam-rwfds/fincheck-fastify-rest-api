import { authTokens } from "./auth.tokens";

const TOKENS = Object.freeze({
  Auth: authTokens,
  Database: Symbol.for("Database"),
});

export { TOKENS };
