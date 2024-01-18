import { Command } from "commander";
import { validateStringParameter } from "../utils/validationUtils";
import { createConfigFile, createMigrationsFolder } from "../utils/configUtils";

export const initCommand = (program: Command): void => {
  program
    .command("init <projectName>")
    .option("--t <migrationsTable>", "Name of the migrations table")
    .option("--f <migrationsFolder>", "Name of the migrations folder")
    .description("Initialize a new kai migrations project.")
    .action((projectName: string, options: { t?: string; f?: string }) => {
      try {
        if (!validateParameters(projectName, options.f, options.t)) {
          console.error("Parameters are not valid.");
          return;
        }

        createConfigFile(projectName, options.f, options.t);

        createMigrationsFolder(options.f);

        console.log(`Project ${projectName} was successfully created.`);
      } catch (error) {
        console.error((error as Error).message);
      } finally {
        process.exit(0);
      }

      return;
    });
};

const validateParameters = (
  projectName: string,
  migrationsFolderName?: string,
  migrationsTableName?: string
): boolean => {
  const projectNameIsValid = validateStringParameter(true, projectName);
  const migrationsFolderIsValid = validateStringParameter(
    false,
    migrationsFolderName
  );
  const migrationsTableIsValid = validateStringParameter(
    false,
    migrationsTableName
  );

  return (
    projectNameIsValid && migrationsFolderIsValid && migrationsTableIsValid
  );
};
