import jwt from "jsonwebtoken";
import { env } from "~config/env";
import { InvalidCredentialsException } from "~exceptions/auth/invalid-credentials.exception";
import { TOKENS } from "~infra/tokens";
import type { UsersRepository } from "~repositories/users.repository";
import { type Either, either } from "~utils/either";

type Params = {
  [key in "email" | "password"]: string;
};

type Response = Either<
  InvalidCredentialsException,
  {
    accessToken: string;
  }
>;

type IServiceConstructorParams = {
  [key in symbol]: UsersRepository;
};

abstract class AbstractService {
  #usersRepository: UsersRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#usersRepository = deps[TOKENS.Users.Repository];
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
