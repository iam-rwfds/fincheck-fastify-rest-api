import { EmptyException } from "~infra/exception";

class BankAccountUserNotFoundException extends EmptyException {
  constructor() {
    super({
      statusCode: 404,
      message: "Conta bancária não encontrada.",
    });
  }
}

export { BankAccountUserNotFoundException };
