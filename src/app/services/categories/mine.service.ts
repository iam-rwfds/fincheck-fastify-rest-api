import { either, type Either } from "~utils/either";
import type { Category } from "../../entities/categories.entity";
import type { CategoriesRepository } from "~repositories/categories.repository";
import { TOKENS } from "~infra/tokens";

type SResponse = Either<unknown, Category[]>;

type IServiceConstructorParams = {
  [ḱey in symbol]: CategoriesRepository;
}

abstract class AbstractService {
  #categoriesRepository: CategoriesRepository;

  constructor(deps: IServiceConstructorParams) {
    this.#categoriesRepository = deps[TOKENS.Categories.Repository];
  }

  get categoriesRepository () {
    return this.#categoriesRepository;
  }

  abstract execute(userId: string): Promise<SResponse>;
}

class Service extends AbstractService {
  async execute(userId: string): Promise<SResponse> {
   return either.right(await this.categoriesRepository.getAll(userId));
  }
}

export { Service as GetAllCategoriesFromUserService };
