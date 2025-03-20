import * as v from 'valibot'

interface IEnv {
  // get apiKey(): string;
  get host(): string;
  get port(): number;
}

class Env implements IEnv {
  // #apiKey: string
  #host: string;
  #port: number;

  constructor(init: IEnv) {
    // this.#apiKey = init.apiKey
    this.#host = init.host
    this.#port = init.port
  }  
  
  // get apiKey() {
    // return this.#apiKey;
  // }

  get host() {
    return this.#host
  }

  get port() {
    return this.#port
  }
}

const env = new Env({
  // apiKey: process.env.API_KEY,
  port: Number(process.env.PORT),
  host: process.env.HOST
} as IEnv)

const EnvSchema = v.object({
  apiKey: v.pipe(
    v.string(),
    v.nonEmpty()
  ),
  port: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1)
  ),
  host: v.pipe(
    v.string(),
    v.nonEmpty()
  )
})

const parsedSchema = v.safeParse(EnvSchema, env)

if (parsedSchema.issues) {
  throw new Error(JSON.stringify(parsedSchema.issues, null, 2))
}

export { env }
