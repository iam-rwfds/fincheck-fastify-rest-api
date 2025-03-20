interface IEnv {
  get endpoint(): string;
  get projectId(): string;
  get apiKey(): string;
}

class AppWriteEnv implements IEnv {
  #endpoint: string
  #projectId: string
  #apiKey: string

  constructor(init: IEnv) {
    this.#apiKey = init.apiKey
    this.#endpoint = init.endpoint
    this.#projectId = init.projectId
  }
  
  get endpoint(): string {
   return this.#endpoint   
  }

  get projectId(): string {
    return this.#projectId
  }

  get apiKey(): string {
    return this.#apiKey  
  }
}

const appWriteEnv = new AppWriteEnv({
  apiKey: process.env.APPWRITE_API_KEY,
  endpoint: process.env.APPWRITE_ENDPOINT,
  projectId: process.env.APPWRITE_PROJECT_ID
} as IEnv);

export { appWriteEnv }

