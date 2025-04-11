import * as awilix from "awilix";
import { AuthProvider } from "~controllers/AuthProvider";
import { UsersController } from "~controllers/UsersController";
import { databases } from "~database/databaseClient";
import { CategoriesRepository } from "~repositories/categories.repository";
import { UsersRepository } from "~repositories/users.repository";
import { TOKENS } from "./tokens";
import { AuthSignInService } from "~services/auth/signin.service";
import { AuthSignUpService } from "~services/auth/signup.service";
import { UsersMeService } from "~services/users/me.service";

type ContainerRegistrations = {
  [key in symbol]:
    | AuthSignUpService
    | AuthSignInService
    | AuthProvider
    | CategoriesRepository
    | UsersRepository
    | UsersController
    | UsersMeService
    | typeof databases;
};

export const container = awilix.createContainer<ContainerRegistrations>({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  [TOKENS.Database]: awilix.asValue(databases),

  [TOKENS.Auth.Services.SignUp]: awilix.asClass(AuthSignUpService),
  [TOKENS.Auth.Services.SignIn]: awilix.asClass(AuthSignInService),
  [TOKENS.Auth.Provider]: awilix.asClass(AuthProvider),

  [TOKENS.Categories.Repository]: awilix.asClass(CategoriesRepository),

  [TOKENS.Users.Repository]: awilix.asClass(UsersRepository),
  [TOKENS.Users.Controller]: awilix.asClass(UsersController),
  [TOKENS.Users.Services.Me]: awilix.asClass(UsersMeService),
});

export type { ContainerRegistrations };
