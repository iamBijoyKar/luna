#!/usr/bin/env node

import { Command } from "commander";
import cliSpinners from "cli-spinners";
import ora from "ora";
import { chat } from "./ollama.js";

const program = new Command();

program
  .command("chat")
  .argument("<content>", "chat with the selected or default model")
  .option("-e, --error", "show error messages")
  .action((content, args) => {
    const spinner = ora({
      text: "Generating response...",
      spinner: cliSpinners.dots,
    }).start();
    chat(content, args.error).then((response) => {
      spinner.stop();
      console.log(" ✅ Added to clipboard!");
    });
  });

program.parse();
