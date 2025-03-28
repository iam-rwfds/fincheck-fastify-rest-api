import * as awilix from "awilix";
import * as AppWriteSdk from "node-appwrite";
import { container } from "../../infra/container";
import { env } from "../config/env";

const client = new AppWriteSdk.Client();

if (!env.appWrite) {
  throw new Error("Appwrite is not configured");
}

client
  .setEndpoint(env.appWrite.endpoint)
  .setProject(env.appWrite.projectId)
  .setKey(env.appWrite.apiKey);

client
  .ping()
  .then(() => {
    console.log("Appwrite is connected");
  })
  .catch((err) => {
    console.error(err);
  });

const databases = new AppWriteSdk.Databases(client);

const mainDatabase = await databases.get(env.appWrite.mainDatabaseId);

container.register({
  mainDatabase: awilix.asValue(mainDatabase),
});
