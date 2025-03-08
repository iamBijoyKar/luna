#!/usr/bin/env node

//* lib imports
import { Command } from "commander";
import cliSpinners from "cli-spinners";
import ora from "ora";
import inquirer from "inquirer";

//* local imports
import { chat, listModels, getModels, changeModel } from "./ollama.js";

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

program
  .command("change")
  .description("change the default model")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "model",
          message: "Select a model",
          choices: getModels(),
        },
      ])
      .then((answers) => {
        console.log(`Changing the default model to ${answers.model}`);
        changeModel(answers.model);
      });
  });

program.parse();
