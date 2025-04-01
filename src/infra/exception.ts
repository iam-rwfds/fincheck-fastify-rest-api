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

export { EmptyException };
