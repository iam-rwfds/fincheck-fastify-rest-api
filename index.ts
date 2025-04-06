import Fastify from "fastify";
import { env as projectEnv } from "~config/env";
import authPlugin from "~infra/plugins/auth";
import { routes } from "~routes";

const mainFastifyInstance = Fastify();

const main = async () => {
  try {
    await mainFastifyInstance.register(authPlugin);

    for (const route of routes) {
      mainFastifyInstance.route(route);
    }

    const listeningOptions = {
      port: projectEnv.port,
      host: projectEnv.host,
    };

    await mainFastifyInstance.listen(listeningOptions);

    console.log(
      `APP RUNNING ON ${listeningOptions.host}:${listeningOptions.port}`,
    );
  } catch (error) {
    console.error(error);
  }
};

main();
