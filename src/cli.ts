import { Command, program } from "commander";
import { initCommand } from "./commands/init";
import { createCommand } from "./commands/create";
import { applyCommand } from "./commands/apply";

export function setupCli(): Command {
  program.version("1.0.0").description("Descrição do seu CLI");

  initCommand(program);
  createCommand(program);
  applyCommand(program);

  return program;
}
