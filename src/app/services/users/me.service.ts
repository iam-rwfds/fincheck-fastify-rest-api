import { InvalidCredentialsException } from "~exceptions/auth/invalid-credentials.exception";
import { TOKENS } from "~infra/tokens";
import type { UsersRepository } from "~repositories/users.repository";
import { type Either, either } from "~utils/either";
import type { User } from "../../entities/user.entity";

type Response = Either<
  InvalidCredentialsException,
  Pick<User, "name" | "email">
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
}

class UsersMeService extends AbstractService {
  public async execute(id: string): Promise<Response> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return either.left(new InvalidCredentialsException());
    }

    return either.right({
      email: user.email,
      name: user.name,
    });
  }
}

export { UsersMeService };
