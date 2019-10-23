// 1. create JSON file that grabs path to VBoxManage
// 2. within app.js, grab JSON file and value for VBoxManage
// 3. valudate if path to VBoxManage is valid, if not send error message to console
// 5. import yargs
// 6. create arg for create, grab VM name, cpus, and memory values from user
// 7. Create Shell script for vm creation process and pass in values
// 8. exec shell script from app.js

const VMConfig = require(`../devbox.config`);
const { version } = require(`./package.json`);
const fs = require(`fs`);
const yargs = require(`yargs`);
const inquirer = require(`inquirer`);

// if (fs.existsSync(path)) {
//     return true;
// }

yargs.version(version);

const VMInit = {
  NAME: {
    alias: `n`,
    desc: `Name of the VM`,
    label: `name`,
    type: `string`,
    validate: input => typeof input === "string"
  },
  PROCESSOR: {
    alias: `p`,
    desc: `processor(s)`,
    label: `processor`,
    type: `number`,
    validate: input => !isNaN(input)
  },
  MEMORY: {
    alias: `m`,
    desc: `Memory size (GB)`,
    filter: input => input * 1024,
    label: `memory`,
    type: `number`,
    validate: input => !isNaN(input)
  },
  STORAGE: {
    alias: `s`,
    desc: `Storage size (GB)`,
    filter: input => input * 1024,
    label: `storage`,
    type: `number`,
    validate: input => !isNaN(input)
  }
};

let builderTemplate = {};
for (const key in VMInit) {
  const prop = VMInit[key];
  builderTemplate = {
    ...builderTemplate,
    [prop.label]: {
      alias: prop.alias,
      describe: prop.desc,
      type: prop.type
    }
  };
}

let promptTemplate = {};
for (const key in VMInit) {
  const prop = VMInit[key];
  promptTemplate = {
    ...promptTemplate,
    [prop.label]: {
      name: prop.label,
      message: prop.desc,
      validate: prop.validate,
      prefix: ">",
      suffix: ":"
    }
  };
}

yargs.command({
  command: `create`,
  describe: `Create a new VM`,
  builder: builderTemplate,
  handler(argv) {
    createVM(argv, Object.keys(this.builder));
  }
});

async function createVM(argv, options) {
  let vm = {};
  const emptyValues = [];

  for (const option of options) {
    if (argv[option] === "" || argv[option] === undefined) {
      emptyValues.push(option);
    } else {
      vm[option] = argv[option];
    }
  }

  if (emptyValues.length) {
    let userInput = await prompt(emptyValues);
    vm = { ...vm, ...userInput };
  }

  vm.memory = VMInit.MEMORY.filter(vm.memory);
  vm.storage = VMInit.STORAGE.filter(vm.storage);

  console.log(vm);
}

async function prompt(values) {
  const list = promptTemplate;
  const questions = [];
  let userInput;

  for (const value of values) {
    questions.push(list[value]);
  }

  await inquirer.prompt(questions).then(answers => {
    userInput = answers;
  });

  return userInput;
}

yargs.parse();
