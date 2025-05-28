import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import * as AppWriteSdk from "node-appwrite";
import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import type { BankAccount } from "../../entities/bank-account.entity";
import { CreateBankAccountService } from "./create.service";

let mockDatabases: AppWriteSdk.Databases;
let mockBankAccountRepository: BankAccountRepository;

describe("CreateBankService", async () => {
  beforeEach(() => {
    mockDatabases = {} as AppWriteSdk.Databases;

    mockBankAccountRepository = {
      async create() {
        return {} as BankAccount;
      },
      databases: mockDatabases,
    } as Partial<BankAccountRepository> as BankAccountRepository;
  });

  it("should create a bank account", async () => {
    const userId = AppWriteSdk.ID.unique();

    mockBankAccountRepository.create = async ({ userId, ...dto }) => {
      return {
        ...dto,
        $id: AppWriteSdk.ID.unique(),
        userId: userId,
      };
    };

    const service = new CreateBankAccountService({
      [TOKENS.BankAccounts.Repository]: mockBankAccountRepository,
    });

    const resp = await service.execute({
      name: "Nubank",
      initialBalance: 150,
      color: "#FFFFFF",
      type: "cash",
      userId,
    });

    expect(resp.isRight()).toBe(true);
    expect(resp.value).toMatchObject({
      name: "Nubank",
      initialBalance: 150,
      color: "#FFFFFF",
      type: "cash",
      userId,
    });
  });
});
