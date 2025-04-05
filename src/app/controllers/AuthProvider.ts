import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import type { AuthSignUpService } from "../services/auth/signup.service";
import * as v from "valibot";
import { SignUpSchema } from "~routes/validations/auth/signup.schema";
import type { AuthSignInService } from "../services/auth/signin.service";
import { SignInSchema } from "~routes/validations/auth/signin.schema";

type IProvider<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  signup(request: Req, reply: Reply): Promise<void>;
  signin(request: Req, reply: Reply): Promise<void>;
};

class AuthProvider implements IProvider {
  async signup(request: FastifyRequest, reply: FastifyReply) {
    const authService = container.resolve<AuthSignUpService>(
      TOKENS.Auth.Services.SignUp,
    );

    const { body } = request;

    const parsedSchema = v.safeParse(SignUpSchema, body);

    if (!parsedSchema.success || parsedSchema.issues) {
      reply.code(400).send({
        message: parsedSchema.issues[0].message,
      });

      return;
    }

    const resp = await authService.execute(parsedSchema.output);

    resp.isRight() && reply.code(200).send(resp.value);

    resp.isLeft() &&
      reply.code(resp.value.statusCode).send({
        message: resp.value.message,
      });
  }

  async signin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authService = container.resolve<AuthSignInService>(
      TOKENS.Auth.Services.SignIn,
    );

    const { body } = request;

    const parsedSchema = v.safeParse(SignInSchema, body);

    if (!parsedSchema.success || parsedSchema.issues) {
      reply.code(400).send({
        message: parsedSchema.issues[0].message
      });

      return
    }

    const resp = await authService.execute(parsedSchema.output);

    resp.isRight() && reply.code(200).send(resp.value);

    resp.isLeft() &&
      reply.code(resp.value.statusCode).send({
        message: resp.value.message,
      });
  }
}

export { AuthProvider };
export type { IProvider as IAuthProvider };
