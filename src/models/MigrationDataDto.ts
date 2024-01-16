export class MigrationDataDto {
  id: number;
  uniqueId: string;
  migrationName: string;
  status: number;
  createdAt: Date;
  upSqlContent: string;
  downSqlContent: string;

  constructor(
    id: number,
    uniqueId: string,
    migrationName: string,
    status: number,
    createdAt: Date,
    upSqlContent: string,
    downSqlContent: string
  ) {
    this.id = id;
    this.uniqueId = uniqueId;
    this.migrationName = migrationName;
    this.status = status;
    this.createdAt = createdAt;
    this.upSqlContent = upSqlContent;
    this.downSqlContent = downSqlContent;
  }
}
