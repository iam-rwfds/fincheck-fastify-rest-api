import { EmptyException } from "~infra/exception";

class UserEmailAlreadyExistsException extends EmptyException {
  constructor() {
    super({
      statusCode: 409,
      message: "Um usuário com este email já está cadastrado.",
    });
  }
}

export { UserEmailAlreadyExistsException };
