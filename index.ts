import Fastify from "fastify";
import { routes } from "./src/app/routes";
import { env } from "./src/shared/config/env";

const mainFastifyInstance = Fastify();

for (const route of routes) {
  mainFastifyInstance.route(route);
}

const main = async () => {
  try {
    const listeningOptions = {
      port: env.port,
      host: env.host,
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
