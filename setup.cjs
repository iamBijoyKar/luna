// * Luna Setup
// ? doskey luna=node "<main.js file path>" $*

const { spawn } = require("child_process");
const fs = require("fs");

const setup = () => {
  const setupCommand = `doskey luna=node main.js $*`;
  const setupProcess = spawn("cmd.exe", ["/c", setupCommand], {
    stdio: "inherit",
  });
  setupProcess.on("exit", (code) => {
    process.exit(code);
  });
  fs.writeFileSync("luna.local.json", JSON.stringify({ defaultModel: "" }));
  console.log("Setup complete!");
};

// * Setup the Luna CLI
// Todo: Run `node setup.js` to setup the Luna CLI
setup();
