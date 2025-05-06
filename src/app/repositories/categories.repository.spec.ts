import { beforeEach, describe, expect, it, mock } from "bun:test";
import * as AppWriteSdk from "node-appwrite";
import { TOKENS } from "~infra/tokens";
import { CategoriesRepository } from "./categories.repository";

describe("CategoriesRepository", () => {
  let mockDatabases: AppWriteSdk.Databases;
  let categoriesRepository: CategoriesRepository;

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
    } as Pick<AppWriteSdk.Databases, "createDocument"> as AppWriteSdk.Databases;
    categoriesRepository = new CategoriesRepository({
      [TOKENS.Database]: mockDatabases,
    });
  });

  it("should create a category", async () => {
    const userId = AppWriteSdk.ID.unique();

    const categories = await categoriesRepository.createMany(userId, [
      {
        icon: "Health",
        name: "Saúde",
        type: "expense",
      },
    ]);

    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({
      icon: "Health",
      name: "Saúde",
      type: "expense",
    });
  });
});
