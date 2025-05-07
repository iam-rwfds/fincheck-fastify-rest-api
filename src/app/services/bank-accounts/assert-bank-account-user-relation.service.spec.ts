import { beforeEach, describe, expect, it } from "bun:test";
import * as AppWriteSdk from "node-appwrite";
// import { InvalidCredentialsException } from "~exceptions/auth/invalid-credentials.exception";
import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import type { User } from "../../entities/user.entity";
import { AssertBankAccountUserRelationService } from "./assert-bank-account-user-relation.service";
import { BankAccountUserNotFoundException } from "~exceptions/bank-account/bank-account-user-not-found";
import type { BankAccount } from "../../entities/bank-account.entity";
// import type { UsersRepository } from "~repositories/users.repository";
// import type { User } from "../../entities/user.entity";
// import { UsersMeService } from "./me.service";

const user: User = {
  email: "user-email",
  name: "User Name",
  password: "",
  $id: AppWriteSdk.ID.unique(),
};

const bankAccount: BankAccount = {
  $id: AppWriteSdk.ID.unique(),
  name: "Nubank",
  initialBalance: 150,
  color: "#ffffff",
  type: "cash",
  userId: {
    $id: user.$id,
  } as Partial<User> as User,
};

let mockDatabases: AppWriteSdk.Databases;
let mockBankAccountRepository: BankAccountRepository;

describe("AssertBankAccountUserRelationService", async () => {
  beforeEach(() => {
    mockDatabases = {} as AppWriteSdk.Databases;

    mockBankAccountRepository = {
      async create() {
        return {
          $id: AppWriteSdk.ID.unique(),
          name: "Nubank",
          initialBalance: 150,
          color: "#ffffff",
          type: "cash",
          userId: {
            id: user.$id,
          } as Partial<User> as User,
        };
      },
      async findOne() {
        return null;
      },
      async update(dto) {
        return {
          $id: dto.$id,
          color: dto.color,
          initialBalance: dto.initialBalance,
          name: dto.name,
          type: dto.type,
          userId: {
            $id: user.$id,
          } as Partial<User> as User,
        };
      },
      databases: mockDatabases,
    } as Omit<BankAccountRepository, "#databases"> as BankAccountRepository;
  });

  it("should return a lefty error value if bank account is not found", async () => {
    const service = new AssertBankAccountUserRelationService({
      [TOKENS.BankAccounts.Repository]: mockBankAccountRepository,
    });

    const resp = await service.execute(bankAccount.$id, user.$id);

    expect(resp.isLeft()).toBe(true);
    expect(resp.value).toBeInstanceOf(BankAccountUserNotFoundException);
  });

  it("should return a lefty error value if bank account is found but it doesn't belong to specified user", async () => {
    mockBankAccountRepository.findOne = async () => ({
      ...bankAccount,
      userId: {
        ...bankAccount.userId,
        $id: AppWriteSdk.ID.unique(),
      },
    });

    const service = new AssertBankAccountUserRelationService({
      [TOKENS.BankAccounts.Repository]: mockBankAccountRepository,
    });

    const resp = await service.execute(bankAccount.$id, user.$id);

    expect(resp.isLeft()).toBe(true);
    expect(resp.value).toBeInstanceOf(BankAccountUserNotFoundException);
  });

  it("should return a righty value containing null", async () => {
    mockBankAccountRepository.findOne = async () => {
      return bankAccount;
    };

    const service = new AssertBankAccountUserRelationService({
      [TOKENS.BankAccounts.Repository]: mockBankAccountRepository,
    });

    const resp = await service.execute(bankAccount.$id, user.$id);

    expect(resp.isRight()).toBe(true);
    expect(resp.value).toBeNull();
  });
});
