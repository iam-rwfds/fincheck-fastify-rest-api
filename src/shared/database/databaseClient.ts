import * as awilix from "awilix";
import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";
import { container } from "~infra/container";

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

export { databases };
