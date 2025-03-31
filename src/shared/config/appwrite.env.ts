import * as v from "valibot";
import {
  type IAppWriteCollectionsEnv,
  appWriteCollectionsEnv,
} from "./appwrite-collections.env";

interface IAppWriteEnv {
  get endpoint(): string;
  get projectId(): string;
  get apiKey(): string;

  get mainDatabaseId(): string;
  get collections(): IAppWriteCollectionsEnv;
}

class AppWriteEnv implements IAppWriteEnv {
  #endpoint: string;
  #projectId: string;
  #apiKey: string;
  #mainDatabaseId: string;
  #collectionsEnv: IAppWriteCollectionsEnv;

  constructor(init: IAppWriteEnv) {
    this.#endpoint = init.endpoint;
    this.#projectId = init.projectId;
    this.#apiKey = init.apiKey;

    this.#mainDatabaseId = init.mainDatabaseId;
    this.#collectionsEnv = init.collections;
  }

  get endpoint() {
    return this.#endpoint;
  }

  get projectId() {
    return this.#projectId;
  }

  get apiKey() {
    return this.#apiKey;
  }

  get mainDatabaseId() {
    return this.#mainDatabaseId;
  }

  get collections(): IAppWriteCollectionsEnv {
    return this.#collectionsEnv;
  }
}

const AppWriteEnvSchema = v.object({
  endpoint: v.pipe(v.string(), v.url()),
  projectId: v.pipe(v.string(), v.nonEmpty()),
  apiKey: v.pipe(v.string(), v.nonEmpty()),
  mainDatabaseId: v.pipe(v.string(), v.nonEmpty()),
} satisfies Record<Exclude<keyof IAppWriteEnv, "collections">, unknown>);

const env = new AppWriteEnv({
  projectId: process.env.APPWRITE_PROJECT_ID ?? "",
  endpoint: process.env.APPWRITE_ENDPOINT ?? "",
  apiKey: process.env.APPWRITE_API_KEY ?? "",
  mainDatabaseId: process.env.APPWRITE_MAIN_DATABASE_ID ?? "",
  collections: appWriteCollectionsEnv,
});

const parsedSchema = v.safeParse(AppWriteEnvSchema, env);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { env as appWriteEnv };
export type { IAppWriteEnv };
