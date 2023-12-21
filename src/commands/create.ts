import * as fs from "fs";
import path from "path";
import { Command } from "commander";
import { validateMigrationsFolderIntegrity } from "../utils/integrityUtils";
import { validateStringParameter } from "../utils/validationUtils";

export const createCommand = (program: Command): void => {
  program
    .command("create <migrationName>")
    .description("Create a new migration.")
    .action((migrationName: string) => {
      const currentDirectory = process.cwd();

      const migrationsFolderValidationIntegrityMessage =
        validateMigrationsFolderIntegrity(currentDirectory);
      if (migrationsFolderValidationIntegrityMessage != "") {
        console.error(migrationsFolderValidationIntegrityMessage);
        return;
      }

      if (!validateParameters(migrationName)) {
        console.error("Parameters are not valid.");
        return;
      }

      const formattedMigrationName = buildMigrationName(migrationName);
      const newMigrationFolderPath = getNewMigrationFolderPath(
        formattedMigrationName
      );

      createMigrationFolder(newMigrationFolderPath);
      createMigrationFiles(newMigrationFolderPath, formattedMigrationName);

      console.log(`Migration ${migrationName} successfully created.`);
    });
};

// ** Validates the inputs parameters
const validateParameters = (migrationName: string): boolean => {
  const migrationNameIsValid = validateStringParameter(migrationName);
  return migrationNameIsValid;
};

// ** Builds the migration name
const buildMigrationName = (inputName: string): string => {
  const currentTimestamp = Date.now();
  const migrationName: string = `${currentTimestamp}-${inputName}`;

  return migrationName;
};

// ** Gets the path of the new migration folder
const getNewMigrationFolderPath = (migrationName: string): string => {
  const currentDirectory = process.cwd();

  const migrationsFolderPath = path.join(
    currentDirectory,
    "migrations",
    migrationName
  );

  return migrationsFolderPath;
};

// ** Creates the new folder for this migration
const createMigrationFolder = (migrationFolderPath: string): void => {
  fs.mkdirSync(migrationFolderPath);
};

// ** Creates the migration files (.up.sql and .down.sql)
const createMigrationFiles = (
  migrationFolderPath: string,
  migrationName: string
): void => {
  const upFilePath = path.join(migrationFolderPath, `${migrationName}.up.sql`);

  const downFilePath = path.join(
    migrationFolderPath,
    `${migrationName}.down.sql`
  );

  fs.writeFileSync(
    upFilePath,
    `-- SQL script for migration up (${migrationName})`
  );

  fs.writeFileSync(
    downFilePath,
    `-- SQL script for migration down (${migrationName})`
  );
};
