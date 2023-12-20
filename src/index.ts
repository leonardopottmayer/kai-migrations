#!/usr/bin/env node
import { setupCli } from './cli';

const program = setupCli();
program.parse(process.argv);