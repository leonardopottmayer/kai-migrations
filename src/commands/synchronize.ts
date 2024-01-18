import { Command } from "commander";
import { getEnvironmentByName } from "../utils/configUtils";
import { getLocalMigrations } from "../utils/migrationUtils";
import { validateMigrationsTableIntegrity } from "../utils/integrityUtils";
import {
  getMigrationByName,
  insertMigrationToSpecificEnvironment,
} from "../utils/migrationsTableUtils";
import { LocalMigrationDto } from "../models/LocalMigrationDto";
import { CreateMigrationDto } from "../models/CreateMigrationDto";
import { randomUUID } from "crypto";

export const synchronizeCommand = (program: Command): void => {
  program
    .command("synchronize <environmentName>")
    .description("Synchronizes all the local migrations with the database.")
    .action(async (environmentName: string) => {
      try {
        const foundEnv = getEnvironmentByName(environmentName);
        if (!foundEnv) {
          console.error("No environment found with this name.");
          return;
        }

        validateMigrationsTableIntegrity(foundEnv);
        const migrations: LocalMigrationDto[] = await getLocalMigrations();

        for (const element of migrations) {
          try {
            const migrationOnTheDatabase = await getMigrationByName(
              foundEnv,
              element.migrationName
            );
          } catch (error) {
            const migrationToInsert: CreateMigrationDto = {
              migrationName: element.migrationName,
              uniqueId: randomUUID(),
              status: 1,
              createdAt: new Date(),
            };

            await insertMigrationToSpecificEnvironment(
              foundEnv,
              migrationToInsert
            );

            console.log(
              `Migration ${element.migrationName} was synchronized with the database.`
            );
          }
        }
        console.log(`All the migrations were synchronized.`);
      } catch (error) {
        console.error(error);
      } finally {
        process.exit(0);
      }

      return;
    });
};
