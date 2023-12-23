import { Command } from "commander";
import { executeSqlScripts } from "../utils/scriptExecutor";
import { getEnvironmentByName } from "../utils/configUtils";
import { getAllMigrations } from "../utils/migrationUtils";

export const applyCommand = (program: Command): void => {
  program
    .command("apply <environmentName>")
    .description(
      "Applies all the pending migrations to a specific environment."
    )
    .action((environmentName: string) => {
      try {
        const foundEnv = getEnvironmentByName(environmentName);
        if (!foundEnv) {
          console.error("No environment found with this name.");
          return;
        }

        const migrationsScripts = getAllMigrations("up");

        executeSqlScripts(foundEnv, migrationsScripts);
      } catch (error) {
        console.error(error);
      }
    });
};
