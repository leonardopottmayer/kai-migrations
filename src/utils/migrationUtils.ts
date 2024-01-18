import * as fs from "fs";
import path from "path";
import { getConfig } from "./configUtils";
import { MigrationDataDto } from "../models/MigrationDataDto";
import { getMigrationByName } from "./migrationsTableUtils";
import { ConfigEnvironment } from "../models/ConfigEnvironment";
import { LocalMigrationDto } from "../models/LocalMigrationDto";

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

export const getAllMigrations = async (
  environment: ConfigEnvironment
): Promise<MigrationDataDto[]> => {
  try {
    const currentDirectory = process.cwd();
    const config = getConfig();

    const migrationsPath = path.join(currentDirectory, config.migrationsFolder);
    const migrationFolders = fs.readdirSync(migrationsPath);

    const migrations: MigrationDataDto[] = [];

    for (const folder of migrationFolders) {
      const migration = await getMigrationByName(environment, folder);
      const folderPath = path.join(migrationsPath, folder);
      const isDirectory = fs.statSync(folderPath).isDirectory();

      if (isDirectory) {
        const upFilePath = path.join(folderPath, `${folder}.up.sql`);
        const downFilePath = path.join(folderPath, `${folder}.down.sql`);

        let upFileContent: string = "";
        let downFileContent: string = "";

        if (fs.existsSync(upFilePath)) {
          upFileContent = fs.readFileSync(upFilePath, "utf-8");
        }

        if (fs.existsSync(downFilePath)) {
          downFileContent = fs.readFileSync(downFilePath, "utf-8");
        }

        const migrationData: MigrationDataDto = new MigrationDataDto(
          migration.id,
          migration.uniqueId,
          migration.migrationName,
          migration.status,
          migration.createdAt,
          upFileContent,
          downFileContent
        );

        migrations.push(migrationData);
      }
    }

    return migrations;
  } catch (error) {
    throw error;
  }
};

export const getLocalMigrations = async (): Promise<LocalMigrationDto[]> => {
  try {
    const currentDirectory = process.cwd();
    const config = getConfig();

    const migrationsPath = path.join(currentDirectory, config.migrationsFolder);
    const migrationFolders = fs.readdirSync(migrationsPath);

    const migrations: LocalMigrationDto[] = [];

    for (const folder of migrationFolders) {
      const folderPath = path.join(migrationsPath, folder);
      const isDirectory = fs.statSync(folderPath).isDirectory();

      if (isDirectory) {
        const upFilePath = path.join(folderPath, `${folder}.up.sql`);
        const downFilePath = path.join(folderPath, `${folder}.down.sql`);

        let upFileContent: string = "";
        let downFileContent: string = "";

        if (fs.existsSync(upFilePath)) {
          upFileContent = fs.readFileSync(upFilePath, "utf-8");
        }

        if (fs.existsSync(downFilePath)) {
          downFileContent = fs.readFileSync(downFilePath, "utf-8");
        }

        const migrationData: LocalMigrationDto = new LocalMigrationDto(
          folder,
          upFileContent,
          downFileContent
        );

        migrations.push(migrationData);
      }
    }

    return migrations;
  } catch (error) {
    throw error;
  }
};
