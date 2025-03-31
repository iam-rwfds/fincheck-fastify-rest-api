import * as awilix from "awilix";
import { either, type Either } from "~utils/either";
import { container } from "~infra/container";
import type { UserEmailAlreadyExistsException } from "~exceptions/auth/user-email-already-exists.exception";

type Response = Either<
  UserEmailAlreadyExistsException,
  {
    accessToken: string;
  }
>;

class AuthSignUpService {
  async execute(): Promise<Response> {
    return either.right({
      accessToken: "",
    });
  }
}

export { AuthSignUpService };
