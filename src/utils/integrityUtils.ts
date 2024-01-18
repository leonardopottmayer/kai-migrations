import * as fs from "fs";
import * as path from "path";
import { getConfig } from "./configUtils";
import { executeSqlScript } from "./scriptExecutor";
import { ConfigEnvironment } from "../models/ConfigEnvironment";

export const validateProjectIntegrity = (): void => {};

export const validateConfigIntegrity = (): void => {
  try {
    const config = getConfig();

    validateConfigProjectNameIntegrity();
    validateConfigMigrationsFolderIntegrity();
    validateConfigMigrationsTableIntegrity();
    validateConfigEnvironmentsIntegrity();
  } catch (error) {
    throw error;
  }
};

export const validateConfigProjectNameIntegrity = () => {
  try {
    const config = getConfig();

    if (!config.projectName || config.projectName.trim() === "") {
      throw new Error("Invalid project name in config file.");
    }
  } catch (error) {
    throw error;
  }
};

export const validateConfigMigrationsFolderIntegrity = (): void => {
  try {
    const config = getConfig();

    if (!config.migrationsFolder || config.migrationsFolder.trim() === "") {
      throw new Error("Invalid migrations folder in config file.");
    }
  } catch (error) {
    throw error;
  }
};

export const validateConfigMigrationsTableIntegrity = (): void => {
  try {
    const config = getConfig();

    if (!config.migrationsTable || config.migrationsTable.trim() === "") {
      throw new Error("Invalid migrations table in config file.");
    }
  } catch (error) {
    throw error;
  }
};

export const validateConfigEnvironmentsIntegrity = (): void => {
  try {
    const config = getConfig();

    if (!config.environments || config.environments.length === 0) {
      throw new Error("No environments in config file.");
    }

    const environmentNamesSet = new Set<string>();

    for (const environment of config.environments) {
      if (
        !environment.environmentName ||
        environment.environmentName.trim() === "" ||
        !environment.connectionString ||
        environment.connectionString.trim() === "" ||
        !environment.databaseType ||
        environment.databaseType.trim() === "" ||
        !environment.host ||
        environment.host.trim() === "" ||
        !environment.port ||
        isNaN(environment.port) ||
        !environment.user ||
        environment.user.trim() === "" ||
        !environment.password ||
        environment.password.trim() === "" ||
        !environment.database ||
        environment.database.trim() === ""
      ) {
        throw new Error(
          "Invalid environment configuration in config file. Please provide values for environmentName, connectionString, databaseType, host, port, user, password, and database."
        );
      }

      if (environmentNamesSet.has(environment.environmentName)) {
        throw new Error(
          `Duplicate environment name found in config file: ${environment.environmentName}. Each environment must have a unique name.`
        );
      }

      environmentNamesSet.add(environment.environmentName);
    }
  } catch (error) {
    throw error;
  }
};

export const validateMigrationsFolderIntegrity = (): void => {
  try {
    const currentDirectory = process.cwd();
    const config = getConfig();

    const migrationsFolderPath = path.join(
      currentDirectory,
      config.migrationsFolder
    );

    const fileExists = fs.existsSync(migrationsFolderPath);

    if (!fileExists) {
      throw new Error(
        `Migrations folder not found. Configured migrations folder name: ${config.migrationsFolder}`
      );
    }
  } catch (error) {
    throw error;
  }
};

export const validateMigrationsTableIntegrity = (
  environment: ConfigEnvironment
): void => {
  const tableSelectScript =
    "select m.id, m.unique_id, m.migration_name, m.status, m.created_at from migrations m";

  try {
    executeSqlScript(environment, tableSelectScript);
  } catch (error) {
    throw error;
  }
};
