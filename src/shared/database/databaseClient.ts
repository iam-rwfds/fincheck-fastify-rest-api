import * as AppWriteSdk from "node-appwrite";
import { env } from "~config/env";

const client = new AppWriteSdk.Client();

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
