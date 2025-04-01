import jwt from "jsonwebtoken";
import type * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { UserEmailAlreadyExistsException } from "~exceptions/auth/user-email-already-exists.exception";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import { type Either, either } from "~utils/either";
import type { UsersRepository } from "../../repositories/users.repository";

type Params = {
  [key in "name" | "email" | "password"]: string;
};

type Response = Either<
  UserEmailAlreadyExistsException,
  {
    accessToken: string;
  }
>;

abstract class AbstractService {
  #usersRepository: UsersRepository;

  constructor() {
    this.#usersRepository = container.resolve(TOKENS.Users.Repository);
  }

  get usersRepository() {
    return this.#usersRepository;
  }
}

class AuthSignUpService extends AbstractService {
  #generateAccessToken(sub: string) {
    return jwt.sign({ sub }, env.jwt.secret, {
      expiresIn: env.jwt.signExpiresIn,
    });
  }

  async execute(dto: Params): Promise<Response> {
    const userWithSameEmail = await this.usersRepository.findByEmail(dto.email);

    if (userWithSameEmail) {
      return either.left(new UserEmailAlreadyExistsException());
    }

    const hashedPassword = await Bun.password.hash(dto.password, {
      algorithm: "argon2id",
    });

    const newUser = await this.usersRepository.create(dto);

    const accessToken = this.#generateAccessToken(newUser.$id);

    return either.right({
      accessToken,
    });
  }
}

export { AuthSignUpService };
