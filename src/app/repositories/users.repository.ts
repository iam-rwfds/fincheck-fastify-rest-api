import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { TOKENS } from "~infra/tokens";
import type { User } from "../entities/user.entity";

interface IRepository {
  findByEmail(email: User["email"]): Promise<User | null>;
  findById(id: User["$id"]): Promise<User | null>;
}

type IRepositoryConstructorParams = {
  [key in symbol]: AppWriteSdk.Databases;
};

abstract class AbstractRepository implements IRepository {
  #databases: AppWriteSdk.Databases;

  constructor(deps: IRepositoryConstructorParams) {
    this.#databases = deps[TOKENS.Database];
  }

  get databases() {
    return this.#databases;
  }

  abstract findByEmail(email: User["email"]): Promise<User | null>;
  abstract create(
    dto: Pick<User, "email" | "name" | "password">,
  ): Promise<User>;
  abstract findById(id: User["$id"]): Promise<User | null>;
}

class UsersRepository extends AbstractRepository implements IRepository {
  async findByEmail(email: User["email"]): Promise<User | null> {
    const usersDocumentsWithEmail = await this.databases.listDocuments(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.usersId,
      [AppWriteSdk.Query.equal("email", email)],
    );

    if (usersDocumentsWithEmail.total === 0) {
      return null;
    }

    const user = {} as User;

    user.email = usersDocumentsWithEmail.documents[0].email;
    user.name = usersDocumentsWithEmail.documents[0].name;
    user.password = usersDocumentsWithEmail.documents[0].password;
    user.$id = usersDocumentsWithEmail.documents[0].$id;

    return user;
  }

  async create(dto: Pick<User, "email" | "name" | "password">): Promise<User> {
    const user = {} as User;

    const userDocument = await this.databases.createDocument(
      env.appWrite.mainDatabaseId,
      env.appWrite.collections.usersId,
      "unique()",
      {
        ...dto,
      },
    );

    user.password = userDocument.password;
    user.name = userDocument.name;
    user.email = userDocument.email;
    user.$id = userDocument.$id;

    return user;
  }

  async findById(id: User["$id"]): Promise<User | null> {
    try {
      const userDocument = await this.databases.getDocument(
        env.appWrite.mainDatabaseId,
        env.appWrite.collections.usersId,
        id,
      );

      const user = {} as User;

      user.email = userDocument.email;
      user.name = userDocument.name;
      user.password = userDocument.password;
      user.$id = userDocument.$id;

      return user;
    } catch (_) {
      return null;
    }
  }
}

export { UsersRepository };
