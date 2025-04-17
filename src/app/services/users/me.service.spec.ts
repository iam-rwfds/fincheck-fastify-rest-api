import { beforeEach, describe, expect, it } from "bun:test";
import type { UsersRepository } from "~repositories/users.repository";
import * as AppWriteSdk from "node-appwrite";
import { UsersMeService } from "./me.service";
import { TOKENS } from "~infra/tokens";
import type { User } from "../../entities/user.entity";
import { InvalidCredentialsException } from "~exceptions/auth/invalid-credentials.exception";

const user: User = {
  email: "user-email",
  name: "User Name",
  password: "",
  $id: AppWriteSdk.ID.unique(),
};

let mockDatabases: AppWriteSdk.Databases;
let mockUsersRepository: UsersRepository;

describe("UsersMeService", async () => {
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
  });

  it("should return a lefty error value if an user with same email doesnt exist", async () => {
    const service = new UsersMeService({
      [TOKENS.Users.Repository]: mockUsersRepository,
    });

    const resp = await service.execute(user.$id);

    expect(resp.isLeft()).toBe(true);
    expect(resp.value).toBeInstanceOf(InvalidCredentialsException);
  });

  it("should return a righty value containing email and name of the user", async () => {
    mockUsersRepository.findById = async () => {
      return user;
    };

    const service = new UsersMeService({
      [TOKENS.Users.Repository]: mockUsersRepository,
    });

    const resp = await service.execute(user.$id);

    expect(resp.isRight()).toBe(true);
    expect(resp.value).toMatchObject({
      email: user.email,
      name: user.name,
    });
  });
});
