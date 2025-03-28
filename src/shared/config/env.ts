import * as v from "valibot";
import { type IAppWriteEnv, appWriteEnv } from "./appwrite.env";

interface IEnv {
  get host(): string;
  get port(): number;
  get appWrite(): IAppWriteEnv | null;
}

class Env implements IEnv {
  #host: IEnv["host"];
  #port: IEnv["port"];
  #appWrite: IEnv["appWrite"];

  constructor(init: IEnv) {
    this.#host = init.host;
    this.#port = init.port;
    this.#appWrite = init.appWrite || null;
  }

  get host() {
    return this.#host;
  }

  get port() {
    return this.#port;
  }

  get appWrite(): IAppWriteEnv | null {
    return this.#appWrite;
  }
}

const env = new Env({
  port: Number(process.env.PORT),
  host: process.env.HOST,
  appWrite: appWriteEnv || null,
} as IEnv);

const EnvSchema = v.object({
  port: v.pipe(v.number(), v.integer(), v.minValue(1)),
  host: v.pipe(v.string(), v.nonEmpty()),
});

const parsedSchema = v.safeParse(EnvSchema, env);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { env };
