import { EmptyException } from "~infra/exception";

class InvalidCredentialsException extends EmptyException {
  constructor() {
    super({
      statusCode: 401,
      message: "Credenciais Inválidas",
    });
  }
}

export { InvalidCredentialsException };
