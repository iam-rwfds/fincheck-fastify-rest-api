import * as awilix from "awilix";
import { AuthProvider } from "~controllers/AuthProvider";
import { UsersController } from "~controllers/UsersController";
import { BankAccountsController } from "~controllers/bank-accounts.controller";
import { databases } from "~database/databaseClient";
import { BankAccountRepository } from "~repositories/bank-accounts.repository";
import { CategoriesRepository } from "~repositories/categories.repository";
import { UsersRepository } from "~repositories/users.repository";
import { AuthSignInService } from "~services/auth/signin.service";
import { AuthSignUpService } from "~services/auth/signup.service";
import { AssertBankAccountUserRelationService } from "~services/bank-accounts/assert-bank-account-user-relation.service";
import { CreateBankAccountService } from "~services/bank-accounts/create.service";
import { UpdateBankAccountService } from "~services/bank-accounts/update.service";
import { UsersMeService } from "~services/users/me.service";
import { TOKENS } from "./tokens";
import { GetAllBankAccountsFromUserService } from "~services/bank-accounts/get-all-from-user.service";

type ContainerRegistrations = {
  [key in symbol]:
    | AuthSignUpService
    | AuthSignInService
    | AuthProvider
    | CategoriesRepository
    | UsersRepository
    | UsersController
    | UsersMeService
    | BankAccountRepository
    | BankAccountsController
    | CreateBankAccountService
    | UpdateBankAccountService
    | AssertBankAccountUserRelationService
    | GetAllBankAccountsFromUserService
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

  [TOKENS.BankAccounts.Repository]: awilix.asClass(BankAccountRepository),
  [TOKENS.BankAccounts.Controller]: awilix.asClass(BankAccountsController),
  [TOKENS.BankAccounts.Services.Create]: awilix.asClass(
    CreateBankAccountService,
  ),
  [TOKENS.BankAccounts.Services.Update]: awilix.asClass(
    UpdateBankAccountService,
  ),
  [TOKENS.BankAccounts.Services.AssertUserRelation]: awilix.asClass(
    AssertBankAccountUserRelationService,
  ),
  [TOKENS.BankAccounts.Services.GetAllFromUser]: awilix.asClass(
    GetAllBankAccountsFromUserService,
  ),
});

export type { ContainerRegistrations };
