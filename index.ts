import Fastify from "fastify";
import { env as projectEnv } from "~config/env";
import { routes } from "~routes";

const mainFastifyInstance = Fastify();

for (const route of routes) {
  mainFastifyInstance.route(route);
}

const main = async () => {
  try {
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
