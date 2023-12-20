import { Command, program } from "commander";
import { initCommand } from "./commands/init";
import { create } from "./commands/create";

export function setupCli(): Command {
  program.version("1.0.0").description("Descrição do seu CLI");

  initCommand(program);
  create(program);

  return program;
}
