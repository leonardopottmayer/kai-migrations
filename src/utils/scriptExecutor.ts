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

export const executeSqlScript = async (
  environment: ConfigEnvironment,
  sqlScript: string
): Promise<void> => {
  const db = getDbInstance(environment);

  try {
    await db.raw(sqlScript);
  } catch (error) {
    throw error;
  } finally {
    db.destroy();
  }
};
