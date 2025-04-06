import fastifyJwt from "@fastify/jwt";
import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import fp from "fastify-plugin";
import { env } from "~config/env";

export default fp(async (fastify, _opts) => {
  fastify.register(fastifyJwt, {
    secret: env.jwt.secret,
    messages: {
      badRequestErrorMessage: "O formato de autorização é do tipo Bearer token",
      noAuthorizationInHeaderMessage:
        "Nenhum cabeçalho de autorização foi encontrado em request.headers",
      authorizationTokenExpiredMessage: "Token expirado",
      authorizationTokenInvalid: (err) => `Autenticação falhou: ${err.message}`,
    },
  });

  fastify.decorate(
    "authenticate",
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      done?: HookHandlerDoneFunction,
    ) => {
      try {
        await request.jwtVerify();

        const userId = await request.jwtDecode();

        request.user = {
          id: userId,
        };

        done?.();
      } catch (err) {
        reply.code(401).send({
          error: "Authentication required",
          message:
            (err &&
              typeof err === "object" &&
              "message" in err &&
              err.message) ||
            "",
        });
      }
    },
  );
});
