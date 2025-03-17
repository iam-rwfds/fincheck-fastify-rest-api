import Fastify from "fastify";
import { routes } from "./src/app/routes";

const mainFastifyInstance = Fastify();

for (const route of routes) {
  mainFastifyInstance.route(route);
}

const main = async () => {
  try {
    const listeningOptions = {
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || "localhost",
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
