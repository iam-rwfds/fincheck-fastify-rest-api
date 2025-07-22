import cors from "@fastify/cors";
import Fastify from "fastify";
import { env as projectEnv } from "~config/env";
import authPlugin from "~infra/plugins/auth";
import { routes } from "~routes";

const mainFastifyInstance = Fastify();

const main = async () => {
  try {
    await mainFastifyInstance.register(authPlugin);
    await mainFastifyInstance.register(cors, {
      origin: projectEnv.origins,
    });

    mainFastifyInstance.addHook("onRequest", (request, _reply, done) => {
      if (request.headers.origin) {
        console.log(`Request from origin: ${request.headers.origin}`);
      }
      done();
    });

    for (const route of routes) {
      mainFastifyInstance.route(route);
    }

    const listeningOptions = {
      port: projectEnv.port,
      host: projectEnv.host,
    };

    for (const { method, url } of routes) {
      console.table({
        method,
        url,
      });
    }

    // console.log("");

    await mainFastifyInstance.listen(listeningOptions);

    console.log(
      `APP RUNNING ON ${listeningOptions.host}:${listeningOptions.port}`,
    );
  } catch (error) {
    console.error(error);
  }
};

main();
