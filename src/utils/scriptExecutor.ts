import knex from "knex";
import { ConfigFileEnvironment } from "../models/ConfigFileEnvironment";

export const buildDb = (environment: ConfigFileEnvironment) => {
  const db = knex({
    client: environment.databaseType,
    connection: environment.connectionString,
  });

  return db;
};

export const executeSqlScripts = (
  environment: ConfigFileEnvironment,
  sqlScripts: string[]
): void => {
  const db = buildDb(environment);

  sqlScripts.forEach(async (script) => {
    db.raw(script)
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        db.destroy();
      });
  });
};

export const executeSqlScript = (
  environment: ConfigFileEnvironment,
  sqlScript: string
): void => {
  const db = buildDb(environment);

  db.raw(sqlScript)
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      db.destroy();
    });
};
