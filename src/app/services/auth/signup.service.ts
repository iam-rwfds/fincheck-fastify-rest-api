import jwt from "jsonwebtoken";
import { env } from "~config/env";
import { UserEmailAlreadyExistsException } from "~exceptions/auth/user-email-already-exists.exception";
import { TOKENS } from "~infra/tokens";
import type { CategoriesRepository } from "~repositories/categories.repository";
import type { UsersRepository } from "~repositories/users.repository";
import { type Either, either } from "~utils/either";

type Params = {
  [key in "name" | "email" | "password"]: string;
};

type Response = Either<
  UserEmailAlreadyExistsException,
  {
    accessToken: string;
  }
>;

type IServiceConstructorParams = {
  [key in symbol]: UsersRepository | CategoriesRepository;
};

abstract class AbstractService {
  #usersRepository: UsersRepository;
  #categoriesRepository: CategoriesRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#usersRepository = deps[TOKENS.Users.Repository] as UsersRepository;
    this.#categoriesRepository = deps[
      TOKENS.Categories.Repository
    ] as CategoriesRepository;
  }

  get usersRepository() {
    return this.#usersRepository;
  }

  get categoriesRepository(): CategoriesRepository {
    return this.#categoriesRepository;
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

    const newUser = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.categoriesRepository.createMany(newUser.$id, [
      { name: "Salário", icon: "salary", type: "income" },
      {
        name: "Freelance",
        icon: "freelance",
        type: "income",
      },
      { name: "Outro", icon: "other", type: "income" },
      { name: "Casa", icon: "home", type: "expense" },
      { name: "Alimentação", icon: "food", type: "expense" },
      {
        name: "Educação",
        icon: "education",
        type: "expense",
      },
      { name: "Lazer", icon: "fun", type: "expense" },
      { name: "Mercado", icon: "grocery", type: "expense" },
      { name: "Roupas", icon: "clothes", type: "expense" },
      {
        name: "Transporte",
        icon: "transport",
        type: "expense",
      },
      { name: "Viagem", icon: "travel", type: "expense" },
      { name: "Outro", icon: "other", type: "expense" },
    ]);

    const accessToken = this.#generateAccessToken(newUser.$id);

    return either.right({
      accessToken,
    });
  }
}

export { AuthSignUpService };
