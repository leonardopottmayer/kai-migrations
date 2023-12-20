import * as fs from "fs";
import path from "path";
import { Command } from "commander";
import { KaiConfigFile } from "../models/KaiConfigFile";
import { ConfigFileEnvironment } from "../models/ConfigFileEnvironment";
import { validateStringParameter } from "../utils/validationUtils";

export const initCommand = (program: Command): void => {
  program
    .command("init <projectName>")
    .description("Initialize a new kai migrations project.")
    .action((projectName: string) => {
      if (!validateParameters(projectName)) {
        console.error("Parameters are not valid.");
        return;
      }

      createConfigFile(projectName);
      createMigrationsFolder();

      console.log(`Project ${projectName} was successfully created.`);
    });
};

// ** Validates the inputs parameters
const validateParameters = (projectName: string): boolean => {
  const projectNameIsValid = validateStringParameter(projectName);

  return projectNameIsValid;
};

// ** Creates the configuration file
const createConfigFile = (projectName: string) => {
  const currentDirectory = process.cwd();

  const initialEnvironment = new ConfigFileEnvironment("demo", "");
  const kaiConfig = new KaiConfigFile(projectName, "", [initialEnvironment]);

  const configFilePath = path.join(currentDirectory, "kai-config.json");

  fs.writeFileSync(configFilePath, JSON.stringify(kaiConfig, null, 2));
};

// ** Creates the migrations folder
const createMigrationsFolder = () => {
  const currentDirectory = process.cwd();

  const migrationsFolderPath = path.join(currentDirectory, "migrations");
  fs.mkdirSync(migrationsFolderPath);
};
