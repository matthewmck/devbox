// 1. create JSON file that grabs path to VBoxManage
// 2. within app.js, grab JSON file and value for VBoxManage
// 3. valudate if path to VBoxManage is valid, if not send error message to console
// 5. import yargs
// 6. create arg for create, grab VM name, cpus, and memory values from user
// 7. Create Shell script for vm creation process and pass in values
// 8. exec shell script from app.js

const VMConfig = require(`../devbox.config`);
const { version } = require(`../package.json`);
const fs = require(`fs`);
const yargs = require(`yargs`);
const { commandOptions } = require(`./create/options.template`);
const create = require(`./create`);

const { listHostOnlyIfs } = require("./utils/network.utils");

// if (fs.existsSync(path)) {
//     return true;
// }

yargs.version(version);

yargs.command({
  command: `create`,
  describe: `Create a new VM`,
  builder: commandOptions,
  handler(argv) {
    create(argv, Object.keys(commandOptions));
  }
});

yargs.parse();
