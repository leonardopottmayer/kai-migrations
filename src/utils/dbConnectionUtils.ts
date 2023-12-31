import knex from "knex";
import { ConfigEnvironment } from "../models/ConfigEnvironment";

export const getDbInstance = (environment: ConfigEnvironment) => {
  const db = knex({
    client: environment.databaseType,
    connection: environment.connectionString,
  });

  return db;
};
