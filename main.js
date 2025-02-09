#!/usr/bin/env node

import { Command } from "commander";
import cliSpinners from "cli-spinners";
import ora from "ora";
import { chat, listModels } from "./ollama.js";

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
      if (response.status === "success") {
        console.log("✅ Added to clipboard!");
      } else {
        console.error("❌ Failed to chat with model");
      }
    });
  });

program
  .command("list")
  .description("list available models")
  .action(() => {
    listModels().then((models) => {
      console.log(models);
    });
  });

program.parse();
