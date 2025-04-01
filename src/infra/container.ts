import * as awilix from "awilix";
import { AuthProvider } from "~controllers/AuthProvider";
import { databases } from "~database/databaseClient";
import { UsersRepository } from "../app/repositories/users.repository";
import { AuthSignUpService } from "../app/services/auth/signup.service";
import { TOKENS } from "./tokens";
import { AuthSignInService } from "../app/services/auth/signin.service";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  [TOKENS.Database]: awilix.asValue(databases),

  [TOKENS.Auth.Services.SignUp]: awilix.asClass(AuthSignUpService),
  [TOKENS.Auth.Services.SignIn]: awilix.asClass(AuthSignInService),
  [TOKENS.Auth.Provider]: awilix.asClass(AuthProvider),

  [TOKENS.Users.Repository]: awilix.asClass(UsersRepository),
});
