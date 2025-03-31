import * as awilix from "awilix";
import { AuthProvider } from "~controllers/AuthProvider";
import { databases } from "~database/databaseClient";
import { AuthSignUpService } from "../app/services/auth/signup.service";
import { TOKENS } from "./tokens";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  [TOKENS.Database]: awilix.asValue(databases),
  [TOKENS.Auth.Services.SignUp]: awilix.asClass(AuthSignUpService),
  [TOKENS.Auth.Provider]: awilix.asClass(AuthProvider),
});
