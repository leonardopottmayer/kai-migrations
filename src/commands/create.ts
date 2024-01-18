import { Command } from "commander";
import {
  validateConfigEnvironmentsIntegrity,
  validateConfigMigrationsTableIntegrity,
  validateMigrationsFolderIntegrity,
} from "../utils/integrityUtils";
import { validateStringParameter } from "../utils/validationUtils";
import {
  buildMigrationName,
  createMigrationFiles,
  createMigrationFolder,
  getNewMigrationFolderPath,
} from "../utils/migrationUtils";
import { insertMigrationToAllEnvironments } from "../utils/migrationsTableUtils";
import { CreateMigrationDto } from "../models/CreateMigrationDto";
import { randomUUID } from "crypto";

export const createCommand = (program: Command): void => {
  program
    .command("create <migrationName>")
    .description("Create a new migration.")
    .action(async (migrationName: string) => {
      try {
        validateMigrationsFolderIntegrity();
        validateConfigMigrationsTableIntegrity();
        validateConfigEnvironmentsIntegrity();

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

        const migrationToInsert: CreateMigrationDto = {
          migrationName: formattedMigrationName,
          uniqueId: randomUUID(),
          status: 1,
          createdAt: new Date(),
        };

        await insertMigrationToAllEnvironments(migrationToInsert);

        console.log(`Migration ${migrationName} successfully created.`);
      } catch (error) {
        console.error((error as Error).message);
      } finally {
        process.exit(0);
      }

      return;
    });
};

const validateParameters = (migrationName: string): boolean => {
  const migrationNameIsValid = validateStringParameter(true, migrationName);
  return migrationNameIsValid;
};
