// * Luna Setup
// ? doskey luna=node "<main.js file path>" $*

const { spawn } = require("child_process");

const setup = () => {
  const setupCommand = `doskey luna=node main.js $*`;
  const setupProcess = spawn("cmd.exe", ["/c", setupCommand], {
    stdio: "inherit",
  });
  setupProcess.on("exit", (code) => {
    process.exit(code);
  });
};

// * Setup the Luna CLI
// Todo: Run `node setup.js` to setup the Luna CLI
setup();
console.log(__filename);
