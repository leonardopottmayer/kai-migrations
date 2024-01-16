import { Command } from "commander";
import { executeSqlScript, executeSqlScripts } from "../utils/scriptExecutor";
import { getEnvironmentByName } from "../utils/configUtils";
import { getAllMigrations } from "../utils/migrationUtils";
import { validateMigrationsTableIntegrity } from "../utils/integrityUtils";
import { MigrationDataDto } from "../models/MigrationDataDto";
import { updateMigrationStatus } from "../utils/migrationsTableUtils";

export const applyCommand = (program: Command): void => {
  program
    .command("apply <environmentName>")
    .description(
      "Applies all the pending migrations to a specific environment."
    )
    .action(async (environmentName: string) => {
      try {
        const foundEnv = getEnvironmentByName(environmentName);
        if (!foundEnv) {
          console.error("No environment found with this name.");
          return;
        }

        validateMigrationsTableIntegrity(foundEnv);
        const migrations: MigrationDataDto[] = await getAllMigrations(foundEnv);

        const firstMigrationWithPendingStatus = migrations.find(
          (x) => x.status == 1
        );

        if (firstMigrationWithPendingStatus) {
          migrations.forEach((element) => {
            if (element.status == 1) {
              executeSqlScript(foundEnv, element.upSqlContent);
              updateMigrationStatus(
                foundEnv,
                element.id,
                element.migrationName,
                2
              );
              console.log(
                `Migration ${element.migrationName} applied successfully.`
              );
            }
          });
        } else {
          console.log("No pending migrations.");
        }
      } catch (error) {
        console.error(error);
      }
    });
};
