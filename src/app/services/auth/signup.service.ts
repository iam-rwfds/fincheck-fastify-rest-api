import { type Either, either } from "../../../utils/either";

interface EmptyExceptionProps {
  statusCode: number;
  message: string;
}

class EmptyException extends Error implements EmptyExceptionProps {
  statusCode: number;

  constructor(data: EmptyExceptionProps) {
    super(data.message);

    this.statusCode = data.statusCode;
  }
}

class UnauthorizedError {}

class ConflictError extends Error {}

type Response = Either<
  ConflictError,
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
