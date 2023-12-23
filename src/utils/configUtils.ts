import * as fs from "fs";
import path from "path";
import { ConfigEnvironment } from "../models/ConfigEnvironment";
import { KaiConfig } from "../models/KaiConfig";

export const DEFAULT_CONFIG_FILE_NAME: string = "kai-config.json";
export const DEFAULT_MIGRATIONS_TABLE: string = "migrations";
export const DEFAULT_MIGRATIONS_FOLDER: string = "migrations";
export const SUPPORTED_DATABASES: string[] = ["mysql2"];

export const getConfig = (): KaiConfig => {
  try {
    const currentDirectory = process.cwd();
    const configFilePath = path.join(
      currentDirectory,
      DEFAULT_CONFIG_FILE_NAME
    );

    const config = JSON.parse(
      fs.readFileSync(configFilePath, "utf-8")
    ) as KaiConfig;

    return config;
  } catch (error) {
    throw new Error("Failed to get config file.");
  }
};

export const createConfigFile = (
  projectName: string,
  migrationsFolder?: string,
  migrationsTable?: string
) => {
  const currentDirectory = process.cwd();

  const initialEnvironment = new ConfigEnvironment(
    "demo",
    "mysql://user:password@host:port/database_name",
    "mysql2"
  );

  const kaiConfig = new KaiConfig(
    projectName,
    migrationsTable ?? DEFAULT_MIGRATIONS_TABLE,
    migrationsFolder ?? DEFAULT_MIGRATIONS_FOLDER,
    [initialEnvironment]
  );

  const configFilePath = path.join(currentDirectory, DEFAULT_CONFIG_FILE_NAME);

  fs.writeFileSync(configFilePath, JSON.stringify(kaiConfig, null, 2));
};

export const createMigrationsFolder = (migrationsFolder?: string) => {
  const currentDirectory = process.cwd();

  const migrationsFolderPath = path.join(
    currentDirectory,
    migrationsFolder ?? DEFAULT_MIGRATIONS_FOLDER
  );
  fs.mkdirSync(migrationsFolderPath);
};

export const getEnvironmentByName = (
  environmentName: string
): ConfigEnvironment | null => {
  try {
    const config = getConfig();

    const environment = config.environments.find(
      (x) => x.environmentName == environmentName
    );

    return environment ? environment : null;
  } catch (error) {
    throw error;
  }
};
