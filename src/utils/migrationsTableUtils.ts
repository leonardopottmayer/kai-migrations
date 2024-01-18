import { ConfigEnvironment } from "../models/ConfigEnvironment";
import { CreateMigrationDto } from "../models/CreateMigrationDto";
import { MigrationDto } from "../models/MigrationDto";
import { getConfig } from "./configUtils";
import { getDbInstance } from "./dbConnectionUtils";

export const insertMigrationToAllEnvironments = async (
  migration: CreateMigrationDto
) => {
  const config = getConfig();
  for (const element of config.environments) {
    const dbInstance = getDbInstance(element);

    try {
      await dbInstance(config.migrationsTable).insert({
        unique_id: migration.uniqueId,
        migration_name: migration.migrationName,
        status: migration.status,
        created_at: migration.createdAt || new Date(),
      });
    } catch (error) {
      throw error;
    } finally {
      dbInstance.destroy();
    }
  }
};

export const insertMigrationToSpecificEnvironment = async (
  environment: ConfigEnvironment,
  migration: CreateMigrationDto
) => {
  const config = getConfig();
  const dbInstance = getDbInstance(environment);

  try {
    await dbInstance(config.migrationsTable).insert({
      unique_id: migration.uniqueId,
      migration_name: migration.migrationName,
      status: migration.status,
      created_at: migration.createdAt || new Date(),
    });
  } catch (error) {
    throw error;
  } finally {
    dbInstance.destroy();
  }
};

export const getMigrationsStatus = async (environmentName: string) => {};

export const updateMigrationStatus = async (
  environment: ConfigEnvironment,
  migrationId: number,
  migrationName: string,
  status: number
) => {
  const config = getConfig();

  const dbInstance = getDbInstance(environment);

  try {
    const result = await dbInstance(config.migrationsTable)
      .where("id", migrationId)
      .update({
        status: status,
      });
  } catch (error) {
    throw new Error(
      `Failed to update migration ${migrationName} status on the database.`
    );
  }
};

export const getMigrationByName = async (
  environment: ConfigEnvironment,
  migrationName: string
): Promise<MigrationDto> => {
  const config = getConfig();

  const dbInstance = getDbInstance(environment);

  const results = await dbInstance(config.migrationsTable)
    .select("*")
    .where("migration_name", migrationName);

  if (results.length != 1) {
    throw new Error(
      `Migration ${migrationName} was not found on the database.`
    );
  }

  const firstResult = results[0];

  const migration: MigrationDto = new MigrationDto(
    firstResult.id,
    firstResult.unique_id,
    firstResult.migration_name,
    firstResult.status,
    firstResult.created_at
  );

  dbInstance.destroy();

  return migration;
};
