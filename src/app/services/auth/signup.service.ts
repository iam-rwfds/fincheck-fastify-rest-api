import jwt from "jsonwebtoken";
import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { UserEmailAlreadyExistsException } from "~exceptions/auth/user-email-already-exists.exception";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import { type Either, either } from "~utils/either";

type Params = {
  [key in "name" | "email" | "password"]: string;
};

type UserDocument = {
  name: string;
  email: string;
  password: string;
  $id: string;
};

type Response = Either<
  UserEmailAlreadyExistsException,
  {
    accessToken: string;
  }
>;

abstract class AbstractService {
  #databases: AppWriteSdk.Databases;

  constructor() {
    this.#databases = container.resolve<AppWriteSdk.Databases>(TOKENS.Database);
  }

  get databases() {
    return this.#databases;
  }
}

class AuthSignUpService extends AbstractService {
  #generateAccessToken(sub: string) {
    return jwt.sign({ sub }, env.jwt.secret, {
      expiresIn: env.jwt.signExpiresIn,
    });
  }

  async execute(dto: Params): Promise<Response> {
    const userWithSameEmail: UserDocument | null =
      (
        (
          await this.databases.listDocuments(
            env.appWrite.mainDatabaseId,
            env.appWrite.collections.usersId,
            [AppWriteSdk.Query.equal("email", dto.email)],
          )
        ).documents as object[] as UserDocument[]
      )[0] || null;

    if (userWithSameEmail) {
      return either.left(new UserEmailAlreadyExistsException());
    }

    const hashedPassword = await Bun.password.hash(dto.password, {
      algorithm: "argon2id",
    });

    const newUser = (await this.databases.createDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.usersId,
      "unique()",
      {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      } satisfies Params,
    )) as Partial<AppWriteSdk.Models.Document> as Params &
      AppWriteSdk.Models.Document;

    const accessToken = this.#generateAccessToken(newUser.$id);

    return either.right({
      accessToken,
    });
  }
}

export { AuthSignUpService };
