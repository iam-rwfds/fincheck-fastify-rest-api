import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { CategoriesRepository } from "~repositories/categories.repository";
import type { UsersRepository } from "~repositories/users.repository";
import type * as AppWriteSdk from "node-appwrite";
import { AuthSignUpService } from "./signup.service";
import { TOKENS } from "~infra/tokens";
import { UserEmailAlreadyExistsException } from "~exceptions/auth/user-email-already-exists.exception";

let mockDatabases: AppWriteSdk.Databases;
let mockUsersRepository: UsersRepository;
let mockCategoriesRepository: CategoriesRepository;

describe("AuthSignUpService", async () => {
  beforeEach(() => {
    mockDatabases = {} as AppWriteSdk.Databases;

    mockUsersRepository = {
      async findByEmail() {
        return null;
      },
      async findById() {
        return null;
      },
      async create() {
        return {
          email: "",
          name: "",
          password: "",
          $id: "",
        };
      },
      databases: mockDatabases,
    } as Omit<UsersRepository, "#databases"> as UsersRepository;

    mockCategoriesRepository = {
      createMany: mock(async () => []),
    } as Partial<CategoriesRepository> as CategoriesRepository;
  });

  it("should return a lefty error value if an user with same email already exists", async () => {
    mockUsersRepository.findByEmail = async () => {
      return {
        email: "",
        name: "",
        password: "",
        $id: "",
      };
    };

    const service = new AuthSignUpService({
      [TOKENS.Users.Repository]: mockUsersRepository,
      [TOKENS.Categories.Repository]: mockCategoriesRepository,
    });

    const resp = await service.execute({
      email: "mail@mail.com",
      name: "M M",
      password: "123456",
    });

    expect(resp.isLeft()).toBe(true);
    expect(resp.value).toBeInstanceOf(UserEmailAlreadyExistsException);
  });

  it("should return a righty value containing an accessToken on successful signup", async () => {
    const service = new AuthSignUpService({
      [TOKENS.Users.Repository]: mockUsersRepository,
      [TOKENS.Categories.Repository]: mockCategoriesRepository,
    });

    const resp = await service.execute({
      email: "mail@mail.com",
      name: "M M",
      password: "123456",
    });

    expect(resp.isRight()).toBe(true);
    expect(resp.value).toHaveProperty("accessToken");
    expect(resp.isRight() && resp.value?.accessToken).toBeTypeOf("string");
  });
});
