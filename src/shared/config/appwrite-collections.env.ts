import { env } from "bun";
import * as v from "valibot";

interface IEnv {
  get usersId(): string;
  get categoriesId(): string;
}

class AppWriteCollectionsEnv implements IEnv {
  #usersId: string;
  #categoriesId: string;

  constructor(init: IEnv) {
    this.#usersId = init.usersId;
    this.#categoriesId = init.categoriesId;
  }

  get usersId(): string {
    return this.#usersId;
  }

  get categoriesId(): string {
    return this.#categoriesId;
  }
}

const collectionsEnv = new AppWriteCollectionsEnv({
  usersId: env.APPWRITE_COLLECTIONS_USER_ID ?? "",
  categoriesId: env.APPWRITE_COLLECTIONS_CATEGORIES_ID ?? "",
});

const EnvSchema = v.object({
  usersId: v.pipe(v.string(), v.nonEmpty()),
  categoriesId: v.pipe(v.string(), v.nonEmpty()),
});

const parsedSchema = v.safeParse(EnvSchema, collectionsEnv);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { collectionsEnv as appWriteCollectionsEnv };
export type { IEnv as IAppWriteCollectionsEnv };
