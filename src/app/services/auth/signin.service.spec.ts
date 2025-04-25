import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { UsersRepository } from "~repositories/users.repository";
import * as AppWriteSdk from "node-appwrite";
import { AuthSignInService } from "./signin.service";
import { TOKENS } from "~infra/tokens";
import { InvalidCredentialsException } from "~exceptions/auth/invalid-credentials.exception";
import type { User } from "../../entities/user.entity";

let mockDatabases: AppWriteSdk.Databases;
let mockUsersRepository: UsersRepository;

const userRawPassword = "123456";

const user: User = {
  email: "user-email",
  name: "User Name",
  password: Bun.password.hashSync(userRawPassword),
  $id: AppWriteSdk.ID.unique(),
};

describe("AuthSignInService", async () => {
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
        return user;
      },
      databases: mockDatabases,
    } as Omit<UsersRepository, "#databases"> as UsersRepository;
  });

  it("should return a lefty error value if an user with same email doesn't exist", async () => {
    // mockUsersRepository.findByEmail = async () => {
    //   return user;
    // };

    const service = new AuthSignInService({
      [TOKENS.Users.Repository]: mockUsersRepository,
    });

    const resp = await service.execute({
      email: "mail@mail.com",
      password: "123456",
    });

    expect(resp.isLeft()).toBe(true);
    expect(resp.value).toBeInstanceOf(InvalidCredentialsException);
  });

  it("should return a lefty error value when submitted password does not match the one that user has", async () => {
    mockUsersRepository.findByEmail = async () => {
      return {
        ...user,
      };
    };

    const service = new AuthSignInService({
      [TOKENS.Users.Repository]: mockUsersRepository,
    });

    const resp = await service.execute({
      email: user.email,
      password: "wrong-password",
    });

    expect(resp.isLeft()).toBe(true);
    expect(resp.value).toBeInstanceOf(InvalidCredentialsException);
  });

  it("should return a righty value containing an accessToken on successful signin", async () => {
    mockUsersRepository.findByEmail = async () => {
      return {
        ...user,
      };
    };

    const service = new AuthSignInService({
      [TOKENS.Users.Repository]: mockUsersRepository,
    });

    const resp = await service.execute({
      email: user.email,
      password: userRawPassword,
    });

    expect(resp.isRight()).toBe(true);
    expect(resp.value).toHaveProperty("accessToken");
    expect(resp.isRight() && resp.value?.accessToken).toBeTypeOf("string");
  });
});
