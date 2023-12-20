export class ConfigFileEnvironment {
  environmentName: string;
  connectionString: string;

  constructor(environmentName: string, connectionString: string) {
    this.environmentName = environmentName;
    this.connectionString = connectionString;
  }
}
