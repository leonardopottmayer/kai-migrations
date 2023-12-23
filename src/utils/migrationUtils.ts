import * as fs from "fs";
import path from "path";
import { getConfig } from "./configUtils";

export const buildMigrationName = (inputName: string): string => {
  const currentTimestamp = Date.now();
  const migrationName: string = `${currentTimestamp}-${inputName}`;

  return migrationName;
};

export const getNewMigrationFolderPath = (migrationName: string): string => {
  const currentDirectory = process.cwd();
  const config = getConfig();

  const migrationsFolderPath = path.join(
    currentDirectory,
    config.migrationsFolder,
    migrationName
  );

  return migrationsFolderPath;
};

export const createMigrationFolder = (migrationFolderPath: string): void => {
  fs.mkdirSync(migrationFolderPath);
};

export const createMigrationFiles = (
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
    `-- SQL script for migration up (${migrationName}) \n`
  );

  fs.writeFileSync(
    downFilePath,
    `-- SQL script for migration down (${migrationName}) \n`
  );
};

export const getAllMigrations = (action: "up" | "down" | "all") => {
  try {
    const currentDirectory = process.cwd();
    const config = getConfig();

    const migrationsPath = path.join(currentDirectory, config.migrationsFolder);
    const migrationFolders = fs.readdirSync(migrationsPath);

    const filesContent: string[] = [];

    for (const folder of migrationFolders) {
      const folderPath = path.join(migrationsPath, folder);

      const isDirectory = fs.statSync(folderPath).isDirectory();

      if (isDirectory) {
        let filePath: string;

        if (action === "up" || action === "down") {
          filePath = path.join(folderPath, `${folder}.${action}.sql`);
        } else {
          const upFilePath = path.join(folderPath, `${folder}.up.sql`);
          const downFilePath = path.join(folderPath, `${folder}.down.sql`);

          if (fs.existsSync(upFilePath)) {
            const upFileContent = fs.readFileSync(upFilePath, "utf-8");
            filesContent.push(upFileContent);
          }

          if (fs.existsSync(downFilePath)) {
            const downFileContent = fs.readFileSync(downFilePath, "utf-8");
            filesContent.push(downFileContent);
          }

          continue;
        }

        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          filesContent.push(fileContent);
        }
      }
    }

    return filesContent;
  } catch (error) {
    throw error;
  }
};
