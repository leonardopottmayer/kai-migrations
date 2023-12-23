import knex from "knex";
import { ConfigEnvironment } from "../models/ConfigEnvironment";

export const buildDb = (environment: ConfigEnvironment) => {
  const db = knex({
    client: environment.databaseType,
    connection: environment.connectionString,
  });

  return db;
};

export const executeSqlScripts = (
  environment: ConfigEnvironment,
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
  environment: ConfigEnvironment,
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
