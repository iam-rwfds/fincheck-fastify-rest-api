import { beforeAll, beforeEach, describe, expect, it } from "bun:test";
import * as AppWriteSdk from "node-appwrite";
import { TOKENS } from "~infra/tokens";
import type { BankAccountRepository } from "~repositories/bank-accounts.repository";
import { UpdateBankAccountService } from "./update.service";

let mockDatabases: AppWriteSdk.Databases;
let mockBankAccountRepository: BankAccountRepository;

describe("UpdateBankAccountService", async () => {
  beforeEach(() => {
    mockDatabases = {} as AppWriteSdk.Databases;

    mockBankAccountRepository = {
      databases: mockDatabases,
    } as Partial<BankAccountRepository> as BankAccountRepository;
  });

  it("should return an updated bank account", async () => {
    const bankAccountId = AppWriteSdk.ID.unique();
    const userId = AppWriteSdk.ID.unique();

    mockBankAccountRepository.update = async ({ userId, ...dto }) => {
      return {
        ...dto,
        userId,
      };
    };

    const service = new UpdateBankAccountService({
      [TOKENS.BankAccounts.Repository]: mockBankAccountRepository,
    });

    const bankAccountResolution = await service.execute({
      color: "#FFFFFF",
      id: bankAccountId,
      initialBalance: 100,
      name: "Nubank",
      type: "investment",
      userId,
    });

    expect(bankAccountResolution.isRight()).toBe(true);
    expect(bankAccountResolution.value).toMatchObject({
      color: "#FFFFFF",
      $id: bankAccountId,
      initialBalance: 100,
      name: "Nubank",
      type: "investment",
      userId,
    });
  });
});
