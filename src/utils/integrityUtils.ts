import * as fs from "fs";
import * as path from "path";
import { KaiConfigFile } from "../models/KaiConfigFile";

export const validateProjectIntegrity = (projectPath: string): string => {
  const configFileIntegrityMessage = validateConfigFileIntegrity(projectPath);
  if (configFileIntegrityMessage != "") {
    return configFileIntegrityMessage;
  }

  const migrationsFolderIntegrityMessage =
    validateMigrationsFolderIntegrity(projectPath);
  if (migrationsFolderIntegrityMessage != "") {
    return migrationsFolderIntegrityMessage;
  }

  return "";
};

const validateMigrationsFolderIntegrity = (projectPath: string): string => {
  const migrationsFolderPath = path.join(projectPath, "migrations");

  const fileExists = fs.existsSync(migrationsFolderPath);

  return fileExists ? "" : "Migrations folder does not exist.";
};

const validateConfigFileIntegrity = (projectPath: string): string => {
  const configFilePath = path.join(projectPath, "kai-config.json");

  if (!fs.existsSync(configFilePath)) {
    return "Config File does not exist.";
  }

  try {
    const configFileContent = JSON.parse(
      fs.readFileSync(configFilePath, "utf-8")
    ) as KaiConfigFile;

    if (
      !configFileContent.projectName ||
      configFileContent.projectName.trim() === ""
    ) {
      return "Invalid project name in config file.";
    }

    if (
      !configFileContent.migrationsTable ||
      configFileContent.migrationsTable.trim() === ""
    ) {
      return "Invalid migrations table name in config file.";
    }

    if (
      !configFileContent.environments ||
      configFileContent.environments.length === 0
    ) {
      return "No environments in config file.";
    }

    for (const environment of configFileContent.environments) {
      if (
        !environment.environmentName ||
        environment.environmentName.trim() === "" ||
        !environment.connectionString ||
        environment.connectionString.trim() === ""
      ) {
        return "Invalid environment name or connection string in config file.";
      }
    }

    return "";
  } catch (error) {
    return "An error ocurred while trying to validate config file.";
  }
};
