const inquirer = require(`inquirer`);
const chalk = require('chalk');
const { defaults } = require('../../devbox.config');
const { hostInfo, listInterfaces } = require(`../utils/network.utils`);


const generateQuestions = requirements => [
  {
    name: "name",
    message: "Name of VM",
    validate: input => typeof input === "string" && input !== "",
    prefix: `>`,
    suffix: `:`
  },
  {
    name: "processors",
    message: `processors ${chalk.hex('#A1A1A1')(`[Min ${requirements.minCPU} / Max ${requirements.maxCPU}]`)}`,
    validate: input => !isNaN(input) && input !== "",
    default: defaults.cpu,
    prefix: `>`,
    suffix: `:`
  },
  {
    name: "memory",
    message: `Memory size ${chalk.hex('#A1A1A1')(`[Min ${requirements.minRAM}GB / Max ${requirements.maxRAM}GB]`)}`,
    validate: input => !isNaN(input) && input !== "",
    default: defaults.memory,
    prefix: `>`,
    suffix: `:`
  },
  {
    name: "storage",
    message: `Disk space`,
    validate: input => !isNaN(input) && input !== "",
    default: defaults.storage,
    prefix: `>`,
    suffix: `:`
  },
  {
    type: "list",
    name: "network",
    message: "What network are you using to connect to the internet?",
    choices: () => {
      const arr = ['one', 'two']
      return arr;
    },
    when: () => true,
    prefix: `>`,
    suffix: `:`
  }
]

module.exports = async function () {
  let userInput;
  let requirements = await hostInfo();
  let { active } = await listInterfaces();

  if (active.length > 0) {
    const networks = active.map(network => network['Name'])
    console.log(networks);
  }

  const questions = generateQuestions(requirements);

  await inquirer.prompt(questions).then(answers => {
    userInput = answers;
  });

  return userInput;
};
