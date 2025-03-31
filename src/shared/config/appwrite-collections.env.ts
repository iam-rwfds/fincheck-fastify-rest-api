import { env } from "bun";
import * as v from "valibot";

interface IEnv {
  get usersId(): string;
}

class AppWriteCollectionsEnv implements IEnv {
  #usersId: string;

  constructor(init: IEnv) {
    this.#usersId = init.usersId;
  }

  get usersId(): string {
    return this.#usersId;
  }
}

const collectionsEnv = new AppWriteCollectionsEnv({
  usersId: env.APPWRITE_COLLECTIONS_USER_ID ?? "",
});

const EnvSchema = v.object({
  usersId: v.pipe(v.string(), v.nonEmpty()),
});

const parsedSchema = v.safeParse(EnvSchema, collectionsEnv);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { collectionsEnv as appWriteCollectionsEnv };
export type { IEnv as IAppWriteCollectionsEnv };
