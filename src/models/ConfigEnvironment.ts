export class ConfigEnvironment {
  environmentName: string;
  connectionString: string;
  databaseType: string;

  constructor(
    environmentName: string,
    connectionString: string,
    databaseType: string
  ) {
    this.environmentName = environmentName;
    this.connectionString = connectionString;
    this.databaseType = databaseType;
  }
}
