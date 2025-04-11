import type { FastifyReply, FastifyRequest } from "fastify";
import * as v from "valibot";
import { TOKENS } from "~infra/tokens";
import { SignInSchema } from "~routes/validations/auth/signin.schema";
import { SignUpSchema } from "~routes/validations/auth/signup.schema";
import type { AuthSignInService } from "../services/auth/signin.service";
import type { AuthSignUpService } from "../services/auth/signup.service";

type IProvider<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  signup(request: Req, reply: Reply): Promise<void>;
  signin(request: Req, reply: Reply): Promise<void>;
};

type IProviderConstructorParams = {
  [key in symbol]: AuthSignInService | AuthSignUpService;
};

class AuthProvider implements IProvider {
  #authSignInService: AuthSignInService;
  #authSignUpService: AuthSignUpService;

  constructor(deps: IProviderConstructorParams) {
    this.#authSignInService = deps[
      TOKENS.Auth.Services.SignIn
    ] as AuthSignInService;
    this.#authSignUpService = deps[
      TOKENS.Auth.Services.SignUp
    ] as AuthSignUpService;
  }

  async signup(request: FastifyRequest, reply: FastifyReply) {
    const { body } = request;

    const parsedSchema = v.safeParse(SignUpSchema, body);

    if (!parsedSchema.success || parsedSchema.issues) {
      reply.code(400).send({
        message: parsedSchema.issues[0].message,
      });

      return;
    }

    const resp = await this.#authSignUpService.execute(parsedSchema.output);

    resp.isRight() && reply.code(200).send(resp.value);

    resp.isLeft() &&
      reply.code(resp.value.statusCode).send({
        message: resp.value.message,
      });
  }

  async signin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { body } = request;

    const parsedSchema = v.safeParse(SignInSchema, body);

    if (!parsedSchema.success || parsedSchema.issues) {
      reply.code(400).send({
        message: parsedSchema.issues[0].message,
      });

      return;
    }

    const resp = await this.#authSignInService.execute(parsedSchema.output);

    resp.isRight() && reply.code(200).send(resp.value);

    resp.isLeft() &&
      reply.code(resp.value.statusCode).send({
        message: resp.value.message,
      });
  }
}

export { AuthProvider };
export type { IProvider as IAuthProvider };
