import * as awilix from "awilix";
import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "../../infra/container";

type IProvider<
  Req extends FastifyRequest = FastifyRequest,
  Reply extends FastifyReply = FastifyReply,
> = {
  signup(request: Req, reply: Reply): unknown;
  signin(request: Req, reply: Reply): unknown;
};

class AuthProvider implements IProvider {
  signup(request: FastifyRequest, reply: FastifyReply): unknown {
    const authService = container.resolve("authService");

    const { body } = request;

    const { value: tokenPayload } = authService.signup(body);

    reply.code(tokenPayload.statusCode).send(tokenPayload.content);

    return null;
  }

  signin(request: FastifyRequest, reply: FastifyReply): unknown {
    const authService = container.resolve("authService");

    const { body } = request;

    const { value: tokenPayload } = authService.signin(body);

    reply.code(tokenPayload.statusCode).send(tokenPayload.content);

    return null;
  }
}

container.register({
  authProvider: awilix.asClass(AuthProvider),
});

export { AuthProvider };
export type { IProvider as IAuthProvider };
