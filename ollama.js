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
    head: ["Model", "Size", "Parameters", "Architecture", "Modified At"],
  });
  modelList["models"].forEach((model) => {
    const families = model.details.families.join(", ");
    const modifiedAt = new Date(model.modified_at).toLocaleString();
    const size = model.size / 1000000000;
    const sizeStr = size.toFixed(2) + " GB";
    table.push([
      model.model,
      sizeStr,
      model.details.parameter_size,
      families,
      modifiedAt,
    ]);
  });
  return table.toString();
}

export function changeModel(model) {
  const lunaLocalFile = "luna.local.json";
  if (!existsSync(lunaLocalFile)) {
    writeFileSync(lunaLocalFile, JSON.stringify({ defaultModel: model }));
  } else {
    const lunaLocal = JSON.parse(readFileSync(lunaLocalFile));
    lunaLocal.defaultModel = model;
    writeFileSync(lunaLocalFile, JSON.stringify(lunaLocal));
  }
  return model;
}

export async function getModels() {
  const list = await ollama.list();
  return list["models"].map((model) => model.model);
}

export async function pullModel(model) {
  try {
    await ollama.pull(model);
    return {
      status: "success",
      message: "Model pulled successfully",
      model: model,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
      model: model,
    };
  }
}
