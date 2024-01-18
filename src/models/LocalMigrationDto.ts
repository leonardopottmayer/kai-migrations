export class LocalMigrationDto {
  migrationName: string;
  upSqlContent: string;
  downSqlContent: string;

  constructor(
    migrationName: string,
    upSqlContent: string,
    downSqlContent: string
  ) {
    this.migrationName = migrationName;
    this.upSqlContent = upSqlContent;
    this.downSqlContent = downSqlContent;
  }
}
