export class MigrationDto {
  id: number;
  uniqueId: string;
  migrationName: string;
  status: number;
  createdAt: Date;

  constructor(
    id: number,
    uniqueId: string,
    migrationName: string,
    status: number,
    createdAt: Date
  ) {
    this.id = id;
    this.uniqueId = uniqueId;
    this.migrationName = migrationName;
    this.status = status;
    this.createdAt = createdAt;
  }
}
