import * as v from "valibot";
import { appWriteEnv, type IAppWriteEnv } from "./appwrite.env";
import { type IJwtEnv, jwtEnv } from "./jwt.env";

interface IEnv {
  get host(): string;
  get port(): number;
  get origins(): string[];

  get jwt(): IJwtEnv;
  get appWrite(): IAppWriteEnv;
}

class Env implements IEnv {
  #host: IEnv["host"];
  #port: IEnv["port"];
  #appWrite: IEnv["appWrite"];
  #jwt: IEnv["jwt"];
  #origins: IEnv["origins"];

  constructor(init: IEnv) {
    this.#host = init.host;
    this.#port = init.port;
    this.#origins = init.origins;

    this.#appWrite = init.appWrite;
    this.#jwt = init.jwt;
  }

  get host(): IEnv["host"] {
    return this.#host;
  }

  get port(): IEnv["port"] {
    return this.#port;
  }

  get origins(): IEnv["origins"] {
    return this.#origins;
  }

  get appWrite(): IEnv["appWrite"] {
    return this.#appWrite;
  }

  get jwt(): IEnv["jwt"] {
    return this.#jwt;
  }
}

const env = new Env({
  port: Number(process.env.PORT),
  host: process.env.HOST || "",
  origins: process.env?.ORIGINS?.split(";") ?? [],
  appWrite: appWriteEnv,
  jwt: jwtEnv,
} satisfies IEnv);

const EnvSchema = v.object({
  port: v.pipe(v.number(), v.integer(), v.minValue(1)),
  host: v.pipe(v.string(), v.nonEmpty()),
  origins: v.pipe(v.array(v.pipe(v.string(), v.nonEmpty())), v.minLength(1)),
});

const parsedSchema = v.safeParse(EnvSchema, env);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { env };
