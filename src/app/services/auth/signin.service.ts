import { InvalidCredentialsException } from "~exceptions/auth/invalid-credentials.exception";
import { either, type Either } from "~utils/either";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import jwt from "jsonwebtoken";
import { env } from "~config/env";
import type { UsersRepository } from "~repositories/users.repository";

type Params = {
  [key in "email" | "password"]: string;
};

type Response = Either<
  InvalidCredentialsException,
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

  abstract execute(dto: Params): Promise<Response>;
}

class AuthSignInService extends AbstractService {
  #generateAccessToken(sub: string) {
    return jwt.sign({ sub }, env.jwt.secret, {
      expiresIn: env.jwt.signExpiresIn,
    });
  }

  public async execute(dto: Params): Promise<Response> {
    const userWithSameEmail = await this.usersRepository.findByEmail(dto.email);

    if (!userWithSameEmail) {
      return either.left(new InvalidCredentialsException());
    }

    const isPasswordValid = await Bun.password.verify(
      dto.password,
      userWithSameEmail.password,
    );

    if (!isPasswordValid) {
      return either.left(new InvalidCredentialsException());
    }

    const accessToken = this.#generateAccessToken(userWithSameEmail.$id);

    return either.right({
      accessToken,
    });
  }
}

export { AuthSignInService };
