const options = require(`./options.init`);
const prompt = require(`./options.prompt`);
const { listInterfaces } = require(`../utils/network.utils`);
const { listHostOnlyIfs } = require("../utils/network.utils");

const inquirer = require("inquirer");

module.exports = async function(argv, optionList) {
  let vm = {};
  const emptyValues = [];

  for (const option of optionList) {
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

  // try {
  //   const { active } = await listInterfaces();
  //   await inquirer
  //     .prompt([
  //       {
  //         type: "list",
  //         name: "network",
  //         message:
  //           "What network interface are you using to connect to the internet?",
  //         choices: ["wifi", "ethernet"]
  //       }
  //     ])
  //     .then(answers => {
  //       console.log(answers);
  //     });
  //   vm.active = active[0]["IPv4 Address"];
  // } catch (e) {
  //   console.error(e);
  // }

  try {
    const hostOnlyAdapters = await listHostOnlyIfs();
    vm.hostOnly = hostOnlyAdapters[0]["Name"];
  } catch (e) {
    console.error(e);
  }

  vm.memory = options.memory.GBtoMB(vm.memory);
  vm.storage = options.storage.GBtoMB(vm.storage);

  console.log(vm);
};
