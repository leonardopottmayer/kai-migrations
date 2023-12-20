import { ConfigFileEnvironment } from "./ConfigFileEnvironment";

export class KaiConfigFile {
  projectName: string;
  migrationsTable: string;
  environments: ConfigFileEnvironment[];

  constructor(
    projectName: string,
    migrationsTable: string,
    environments: ConfigFileEnvironment[]
  ) {
    this.projectName = projectName;
    this.migrationsTable = migrationsTable;
    this.environments = environments;
  }
}
