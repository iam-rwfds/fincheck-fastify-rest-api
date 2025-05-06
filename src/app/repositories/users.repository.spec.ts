import { beforeEach, describe, expect, it, mock } from "bun:test";
import * as AppWriteSdk from "node-appwrite";
import { TOKENS } from "~infra/tokens";
import { UsersRepository } from "./users.repository";

describe("UsersRepository", () => {
  let mockDatabases: AppWriteSdk.Databases;
  let usersRepository: UsersRepository;

  beforeEach(() => {
    mockDatabases = {
      createDocument: mock(
        async (
          _,
          __,
          ___,
          data: {
            userId: string;
            icon: string;
            name: string;
            type: string;
          },
        ) => ({
          ...data,
          $id: AppWriteSdk.ID.unique(),
        }),
      ),
      getDocument: mock(async (_, __, userId: string) => ({
        $id: userId,
      })),
      listDocuments: mock(async (_, __, queries: unknown[]) => {
        if (queries.length > 0) {
          const query = JSON.parse(queries[0] as string);

          if (query.method === "equal" && query.attribute === "email") {
            return {
              total: 1,
              documents: [
                {
                  $id: AppWriteSdk.ID.unique(),
                  email: query.values[0],
                },
              ],
            };
          }
        }

        return {
          total: 0,
          documents: [],
        };
      }),
    } as Pick<AppWriteSdk.Databases, "createDocument"> as AppWriteSdk.Databases;

    usersRepository = new UsersRepository({
      [TOKENS.Database]: mockDatabases,
    });
  });

  it("should not return an user, when trying to get by id and the database function to retrieve one throws", async () => {
    mockDatabases.getDocument = mock(async () => {
      throw {};
    });

    const userId = AppWriteSdk.ID.unique();

    const user = await usersRepository.findById(userId);

    expect(user).toBeNull();
  });

  it("should return an user, when trying to get by id and the database function retrieves one", async () => {
    const userId = AppWriteSdk.ID.unique();

    const user = await usersRepository.findById(userId);

    expect(user).not.toBeNull();
    expect(user).toMatchObject({
      $id: userId,
    });
  });

  it("should not return an user, when trying to get by email and the database function to retrieve one throws", async () => {
    mockDatabases.listDocuments = mock(async () => ({
      total: 0,
      documents: [],
    }));

    const email = AppWriteSdk.ID.unique();

    const user = await usersRepository.findByEmail(email);

    expect(user).toBeNull();
  });

  it("should return an user, when trying to get by email and the database function retrieves one", async () => {
    const email = AppWriteSdk.ID.unique();

    const user = await usersRepository.findByEmail(email);

    expect(user).not.toBeNull();
    expect(user).toMatchObject({
      email,
    });
  });

  it("should return an user, when creating a new one", async () => {
    // const email = AppWriteSdk.ID.unique();

    const user = await usersRepository.create({
      email: "mail@mail.com",
      name: "John Doe",
      password: "123456",
    });

    expect(user).not.toBeNull();
    expect(user).toMatchObject({
      email: "mail@mail.com",
      name: "John Doe",
      password: "123456",
    });
    expect(user.$id).toBeTruthy();
  });
});
