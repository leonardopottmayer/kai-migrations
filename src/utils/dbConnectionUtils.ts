import knex from "knex";
import { ConfigEnvironment } from "../models/ConfigEnvironment";

export const getDbInstance = (environment: ConfigEnvironment) => {
  const db = knex({
    client: environment.databaseType,
    connection: {
      host: environment.host,
      port: environment.port,
      user: environment.user,
      password: environment.password,
      database: environment.database,
      multipleStatements: true,
    },
  });

  return db;
};
