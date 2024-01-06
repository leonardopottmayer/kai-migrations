import { CreateMigrationDto } from "../models/CreateMigrationDto";
import { getConfig } from "./configUtils";
import { getDbInstance } from "./dbConnectionUtils";

export const insertMigration = async (migration: CreateMigrationDto) => {
  const config = getConfig();
  config.environments.forEach(async (element) => {
    const dbInstance = getDbInstance(element);

    await dbInstance("migrations").insert({
      unique_id: migration.uniqueId,
      migration_name: migration.migrationName,
      status: migration.status,
      created_at: migration.createdAt || new Date(),
    });
  });
};

export const getMigrationsStatus = async (environmentName: string) => {};

export const updateMigrationStatus = async (migrationId: number) => {};
