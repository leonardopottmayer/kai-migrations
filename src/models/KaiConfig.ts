import { ConfigEnvironment } from "./ConfigEnvironment";

export class KaiConfig {
  projectName: string;
  migrationsTable: string;
  migrationsFolder: string;
  environments: ConfigEnvironment[];

  constructor(
    projectName: string,
    migrationsTable: string,
    migrationsFolder: string,
    environments: ConfigEnvironment[]
  ) {
    this.projectName = projectName;
    this.migrationsTable = migrationsTable;
    this.migrationsFolder = migrationsFolder;
    this.environments = environments;
  }
}
