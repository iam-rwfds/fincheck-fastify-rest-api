import * as awilix from "awilix";
import { AuthProvider } from "~controllers/AuthProvider";
import { UsersController } from "~controllers/UsersController";
import { databases } from "~database/databaseClient";
import { UsersRepository } from "../app/repositories/users.repository";
import { AuthSignInService } from "../app/services/auth/signin.service";
import { AuthSignUpService } from "../app/services/auth/signup.service";
import { UsersMeService } from "../app/services/users/me.service";
import { TOKENS } from "./tokens";

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
  [TOKENS.Users.Controller]: awilix.asClass(UsersController),
  [TOKENS.Users.Services.Me]: awilix.asClass(UsersMeService),
});
