import assert from "assert";
import { getModelName, chat, changeModel, getModels } from "../ollama";

describe("Get Current Model Name -> getModelName()", () => {
  it("should return the default model name", async () => {
    const model = await getModelName();
    assert.strictEqual(model, "tinyllama:latest");
  });
});

describe("Chat with Model -> chat()", () => {
  it("should return success status", async () => {
    const response = await chat("Hello, how are you?");
    assert.strictEqual(response.status, "success");
  });
});

describe("Get Available Models -> getModels()", () => {
  it("should return an array of models", async () => {
    const models = await getModels();
    assert.strictEqual(models.length, 2);
  });
});
