import ollama from "ollama";
import clipboard from "clipboardy";

export async function chat(message, errorFlag) {
  const model = getModelName();
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

function getModelName() {
  return "tinyllama";
}
