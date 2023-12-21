import * as fs from "fs";
import path from "path";
import { Command } from "commander";
import { validateProjectIntegrity } from "../utils/integrityUtils";
import { KaiConfigFile } from "../models/KaiConfigFile";
import { ConfigFileEnvironment } from "../models/ConfigFileEnvironment";
import { executeSqlScripts } from "../utils/scriptExecutor";

export const applyCommand = (program: Command): void => {
  program
    .command("apply <environmentName>")
    .description(
      "Applies all the pending migrations to a specific environment."
    )
    .action((environmentName: string) => {
      const currentDirectory = process.cwd();

      const projectIntegrityValidationMessage =
        validateProjectIntegrity(currentDirectory);
      if (projectIntegrityValidationMessage != "") {
        console.error(projectIntegrityValidationMessage);
        return;
      }

      const foundEnv = getEnvironmentByName(environmentName);
      if (!foundEnv) {
        console.error("No environment found with this name.");
        return;
      }

      const migrationsScripts = getAllMigrations("up");

      try {
        executeSqlScripts(foundEnv, migrationsScripts);
      } catch (error) {
        console.error(error);
      }
    });
};

const getEnvironmentByName = (
  environmentName: string
): ConfigFileEnvironment | null => {
  const currentDirectory = process.cwd();
  const configFilePath = path.join(currentDirectory, "kai-config.json");

  try {
    const configFileContent = JSON.parse(
      fs.readFileSync(configFilePath, "utf-8")
    ) as KaiConfigFile;

    const foundEnv = configFileContent.environments.find(
      (x) => x.environmentName == environmentName
    );

    if (foundEnv) {
      return foundEnv;
    }

    return null;
  } catch (error) {
    return null;
  }
};

const getAllMigrations = (action: "up" | "down") => {
  const currentDirectory = process.cwd();
  const migrationsPath = path.join(currentDirectory, "migrations");

  const migrationFolders = fs.readdirSync(migrationsPath);

  const filesContent: string[] = [];

  for (const folder of migrationFolders) {
    const folderPath = path.join(migrationsPath, folder);

    const isDirectory = fs.statSync(folderPath).isDirectory();

    if (isDirectory) {
      const filePath = path.join(folderPath, `${folder}.${action}.sql`);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        filesContent.push(fileContent);
      }
    }
  }

  return filesContent;
};
