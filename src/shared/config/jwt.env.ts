import * as v from "valibot";

interface IEnv {
  get secret(): string;
  get signExpiresIn(): number;
}

class Env implements IEnv {
  #secret: IEnv["secret"];
  #signExpiresIn: IEnv["signExpiresIn"];

  constructor(init: IEnv) {
    this.#secret = init.secret;
    this.#signExpiresIn = init.signExpiresIn;
  }

  get secret(): string {
    return this.#secret;
  }

  get signExpiresIn(): number {
    return this.#signExpiresIn;
  }
}

const env = new Env({
  secret: Bun.env.JWT_SECRET ?? "",
  signExpiresIn: Number(Bun.env.JWT_SIGN_EXPIRES_IN),
} satisfies IEnv);

const EnvSchema = v.object({
  secret: v.pipe(v.string(), v.nonEmpty()),
  signExpiresIn: v.pipe(v.number()),
} satisfies Record<keyof IEnv, unknown>);

const parsedSchema = v.safeParse(EnvSchema, env);

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2));
}

export { env as jwtEnv };
export type { IEnv as IJwtEnv };
