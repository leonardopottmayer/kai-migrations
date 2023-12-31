import { getConfig } from "./configUtils";
import { getDbInstance } from "./dbConnectionUtils";

export const insertMigrations = async (migrationName: string) => {
  const config = getConfig();
  const dbInstance = getDbInstance();

  await this.knex("migrations").insert({
    unique_id: migrationDTO.uniqueId,
    migration_name: migrationDTO.migrationName,
    status: migrationDTO.status,
    created_at: migrationDTO.createdAt || new Date(),
  });
};

export const getMigrationsStatus = async (environmentName: string) => {};

export const updateMigrationStatus = async (migrationId: number) => {};
