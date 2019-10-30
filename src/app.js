const { version } = require(`../package.json`);
const yargs = require(`yargs`);
const create = require(`./create/create`);

yargs.version(version);

yargs.command({
  command: `create`,
  describe: `Create a new VM`,
  handler(argv) {
    create(argv);
  }
});

yargs.parse();
