import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { TOKENS } from "~infra/tokens";
import type { Category } from "../entities/categories.entity";
import type { User } from "../entities/user.entity";

type CreateManyCategoriesParamDTO = Pick<Category, "icon" | "name" | "type">[];

type IRepositoryWithoutConstructor = {
  createMany(
    userId: User["$id"],
    dto: CreateManyCategoriesParamDTO,
  ): Promise<Category[]>;
};

type IRepositoryConstructorParams = {
  [key in symbol]: AppWriteSdk.Databases;
};

abstract class AbstractRepository implements IRepositoryWithoutConstructor {
  #databases: AppWriteSdk.Databases;

  constructor(deps: IRepositoryConstructorParams) {
    this.#databases = deps[TOKENS.Database];
  }

  get databases() {
    return this.#databases;
  }

  abstract createMany(
    userId: User["$id"],
    dto: CreateManyCategoriesParamDTO,
  ): Promise<Category[]>;
}

class CategoriesRepository
  extends AbstractRepository
  implements IRepositoryWithoutConstructor
{
  async createMany(
    userId: User["$id"],
    dto: CreateManyCategoriesParamDTO,
  ): Promise<Category[]> {
    const categories: Category[] = [];

    for (const category of dto) {
      const result = await this.databases.createDocument(
        env.appWrite.mainDatabaseId,
        env.appWrite.collections.categoriesId,
        AppWriteSdk.ID.unique(),
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
