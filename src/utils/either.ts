abstract class Resolution<L, R, V extends L | R = L | R> {
  abstract isLeft(): boolean;
  abstract isRight(): boolean;

  #value: V

  constructor(value: V) {
    this.#value = value
  }

  get value() {
    return this.#value
  }
}

class Left<L, R> extends Resolution<L, R, L> {
  isRight(): this is Right<L, R> {
    return false;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }
}

class Right<L, R> extends Resolution<L, R, R> {
  isLeft(): this is Left<L, R> {
    return false
  }

  isRight(): this is Right<L, R> {
    return true
  }  
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export const either = Object.freeze({
  left: <L, R>(value: L): Either<L, R> => new Left(value),
  right: <L, R>(value: R): Either<L, R> => new Right(value),
})

