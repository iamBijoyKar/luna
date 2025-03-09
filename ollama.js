import ollama from "ollama";
import clipboard from "clipboardy";
import Table from "cli-table";
import { writeFileSync, existsSync, readFileSync } from "fs";

export async function chat(message, errorFlag) {
  const model = await getModelName();
  let response = "";
  try {
    // Chat with the model
    response = await ollama.chat({
      model: model,
      messages: [{ content: message, role: "user" }],
    });
  } catch (error) {
    if (errorFlag) {
      console.error("Failed to chat with model", error);
    }
    return {
      status: "error",
      message: error.message,
      model: model,
      smmsg: "failed to get a response",
    };
  }
  try {
    // Copy the response to the clipboard
    clipboard.writeSync(response.message.content);
  } catch (error) {
    if (errorFlag) {
      console.error("Failed to copy response to clipboard", error);
    }
    return {
      status: "error",
      message: error.message,
      smmsg: "failed to copy response to clipboard",
    };
  }
  return {
    status: "success",
    message: response.message.content,
    model: model,
  };
}

export async function getModelName() {
  const lunaLocalFile = "luna.local.json";
  if (!existsSync(lunaLocalFile)) {
    const modelList = await ollama.list();
    if (modelList.models.length === 0) {
      writeFileSync(lunaLocalFile, JSON.stringify({ defaultModel: "" }));
      throw new Error("No models found");
    }
    writeFileSync(
      lunaLocalFile,
      JSON.stringify({ defaultModel: modelList.models[0].model })
    );
    return modelList.models[0].model;
  }
  const lunaLocal = JSON.parse(readFileSync(lunaLocalFile));
  return lunaLocal.defaultModel;
}

export async function listModels() {
  const modelList = await ollama.list();
  const table = new Table({
    head: ["Name", "Model", "Modified At"],
  });
  modelList["models"].forEach((model) => {
    table.push([model.name, model.model, model.modified_at]);
  });
  return table.toString();
}

export function changeModel() {
  //todo: Change the default model implementation
  return "Model changed";
}

export async function getModels() {
  const list = await ollama.list();
  return list["models"].map((model) => model.model);
}
