import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import type { AuthSignUpService } from "../services/auth/signup.service";

type IProvider<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  signup(request: Req, reply: Reply): Promise<void>;
  signin(request: Req, reply: Reply): unknown;
};

class AuthProvider implements IProvider {
  async signup(request: FastifyRequest, reply: FastifyReply) {
    const authService = container.resolve<AuthSignUpService>(
      TOKENS.Auth.Services.SignUp,
    );

    const { body } = request;

    const resp = await authService.execute(body);

    resp.isRight() && reply.code(200).send(resp.value);

    resp.isLeft() &&
      reply.code(resp.value.statusCode).send({
        message: resp.value.message,
      });
  }

  signin(request: FastifyRequest, reply: FastifyReply): unknown {
    const authService = container.resolve("authService");

    const { body } = request;

    const { value: tokenPayload } = authService.signin(body);

    reply.code(tokenPayload.statusCode).send(tokenPayload.content);

    return null;
  }
}

export { AuthProvider };
export type { IProvider as IAuthProvider };
