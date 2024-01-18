export class ConfigEnvironment {
  environmentName: string;
  connectionString: string;
  databaseType: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;

  constructor(
    environmentName: string,
    connectionString: string,
    databaseType: string,
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
  ) {
    this.environmentName = environmentName;
    this.connectionString = connectionString;
    this.databaseType = databaseType;
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.database = database;
  }
}
