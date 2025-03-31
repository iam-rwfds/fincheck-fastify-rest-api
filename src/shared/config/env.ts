import * as v from "valibot";
import { type IAppWriteEnv, appWriteEnv } from "./appwrite.env";
import { type IJwtEnv, jwtEnv } from "./jwt.env";

interface IEnv {
  get host(): string;
  get port(): number;

  get jwt(): IJwtEnv | null;
  get appWrite(): IAppWriteEnv | null;
}

class Env implements IEnv {
  #host: IEnv["host"];
  #port: IEnv["port"];
  #appWrite: IEnv["appWrite"];
  #jwt: IEnv["jwt"];

  constructor(init: IEnv) {
    this.#host = init.host;
    this.#port = init.port;
    this.#appWrite = init.appWrite;
    this.#jwt = init.jwt;
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

  get jwt(): IJwtEnv | null {
    return this.#jwt;
  }
}

const env = new Env({
  port: Number(process.env.PORT),
  host: process.env.HOST || "",
  appWrite: appWriteEnv || null,
  jwt: jwtEnv || null,
} satisfies IEnv);

const EnvSchema = v.object({
  port: v.pipe(v.number(), v.integer(), v.minValue(1)),
  host: v.pipe(v.string(), v.nonEmpty()),
});

const parsedSchema = v.safeParse(EnvSchema, env);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { env };
