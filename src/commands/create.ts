import { Command } from "commander";
import { validateMigrationsFolderIntegrity } from "../utils/integrityUtils";
import { validateStringParameter } from "../utils/validationUtils";
import {
  buildMigrationName,
  createMigrationFiles,
  createMigrationFolder,
  getNewMigrationFolderPath,
} from "../utils/migrationUtils";

export const createCommand = (program: Command): void => {
  program
    .command("create <migrationName>")
    .description("Create a new migration.")
    .action((migrationName: string) => {
      const currentDirectory = process.cwd();

      try {
        validateMigrationsFolderIntegrity();

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
      } catch (error) {
        console.error((error as Error).message);
      }
    });
};

const validateParameters = (migrationName: string): boolean => {
  const migrationNameIsValid = validateStringParameter(true, migrationName);
  return migrationNameIsValid;
};
