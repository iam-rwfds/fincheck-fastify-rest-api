import { beforeEach, describe, expect, it, jest, mock } from "bun:test";
import { randomUUIDv7 } from "bun";
import type * as AppWriteSdk from "node-appwrite";
import { CategoriesRepository } from "./categories.repository";

describe("CategoriesRepository", () => {
  let mockDatabases: AppWriteSdk.Databases;

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
          $id: randomUUIDv7(),
        }),
      ),
    } as Pick<AppWriteSdk.Databases, "createDocument"> as AppWriteSdk.Databases;
  });
});
