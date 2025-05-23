import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      [key: string]: unknown;
    };
  }
}
