import assert from "assert";
import { getModelName, chat, changeModel, getModels } from "../ollama";

// Set a global timeout of 5000ms for all tests
const TIMEOUT = 5000;

describe("Get Current Model Name -> getModelName()", function () {
  this.timeout(TIMEOUT);
  it("should return the default model name", async () => {
    const model = await getModelName();
    assert.strictEqual(model, "tinyllama:latest");
  });
});

describe("Chat with Model -> chat()", function () {
  this.timeout(TIMEOUT);
  it("should return success status", async () => {
    const response = await chat("Hello, how are you?");
    assert.strictEqual(response.status, "success");
  });
});

describe("Get Available Models -> getModels()", function () {
  this.timeout(TIMEOUT);
  it("should return an array of models", async () => {
    const models = await getModels();
    assert.strictEqual(models.length, 2);
  });
});
