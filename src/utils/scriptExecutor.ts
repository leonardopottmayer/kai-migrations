import { ConfigEnvironment } from "../models/ConfigEnvironment";
import { getDbInstance } from "./dbConnectionUtils";

export const executeSqlScripts = (
  environment: ConfigEnvironment,
  sqlScripts: string[]
): void => {
  const db = getDbInstance(environment);

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
  const db = getDbInstance(environment);

  db.raw(sqlScript)
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      db.destroy();
    });
};
