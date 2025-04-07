import type * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import type { Category } from "../entities/categories.entity";
import type { User } from "../entities/user.entity";

type CreateManyCategoriesParamDTO = Pick<Category, "icon" | "name" | "type">[];

interface IRepository {
  createMany(
    userId: User["$id"],
    dto: CreateManyCategoriesParamDTO,
  ): Promise<Category[]>;
}

abstract class AbstractRepository implements IRepository {
  #databases: AppWriteSdk.Databases;

  constructor() {
    this.#databases = container.resolve<AppWriteSdk.Databases>(TOKENS.Database);
  }

  get databases() {
    return this.#databases;
  }

  abstract createMany(
    userId: User["$id"],
    dto: CreateManyCategoriesParamDTO,
  ): Promise<Category[]>;
}

class CategoriesRepository extends AbstractRepository implements IRepository {
  async createMany(
    userId: User["$id"],
    dto: CreateManyCategoriesParamDTO,
  ): Promise<Category[]> {
    const categories: Category[] = [];

    for (const category of dto) {
      const result = await this.databases.createDocument(
        env.appWrite.mainDatabaseId,
        env.appWrite.collections.categoriesId,
        "unique()",
        {
          ...category,
          userId,
        },
      );

      categories.push({
        $id: result.$id,
        type: result.type,
        name: result.name,
        icon: result.icon,
        userId: result.userId,
      });
    }

    return categories;
  }
}

export { CategoriesRepository };
