const inquirer = require("inquirer");
const {
  listHostOnlyIfs,
  hostInfo,
  listInterfaces
} = require("../utils/network.utils");
const { create, VBoxManage, userVMs, iso } = require("../../devbox.config");
const { exec } = require("../utils/child_process.utils");
const chalk = require("chalk");
const { defaults } = require("../../devbox.config");

const generateQuestions = requirements => [
  {
    name: "name",
    message: "Name",
    validate: input => typeof input === "string" && input !== "",
    prefix: `>`,
    suffix: `:`
  },
  {
    name: "processors",
    message: `processors ${chalk.dim.hex("#A1A1A1")(
      `[Max ${requirements.maxCPU}]`
    )}`,
    validate: input => !isNaN(input) && input !== "",
    default: defaults.cpu,
    prefix: `>`,
    suffix: `:`
  },
  {
    name: "memory",
    message: `Memory ${chalk.dim.hex("#A1A1A1")(
      `[Max ${requirements.maxRAM}GB]`
    )}`,
    validate: input => !isNaN(input) && input !== "",
    default: defaults.memory,
    prefix: `>`,
    suffix: `:`
  },
  {
    name: "storage",
    message: `Disk space (GB)`,
    validate: input => !isNaN(input) && input !== "",
    default: defaults.storage,
    prefix: `>`,
    suffix: `:`
  },
  {
    type: "list",
    name: "network",
    message: "What network are you using to connect to the internet?",
    choices: requirements.networks,
    when: () =>
      Array.isArray(requirements.networks) && requirements.networks.length > 1,
    prefix: `>`,
    suffix: `:`
  }
];

module.exports = async function(argv, optionList) {
  let vm = {};
  let userInput;

  try {
    let requirements = await hostInfo();
    let { active } = await listInterfaces();

    if (active.length > 1) {
      const networks = active.map(network => network["Name"]);
      requirements.networks = networks;
    }

    const questions = generateQuestions(requirements);

    await inquirer.prompt(questions).then(answers => {
      userInput = answers;
    });

    if (userInput.network) {
      const activeNetwork = active.filter(
        network => network["Name"] === userInput.network
      )[0];
      userInput.network = activeNetwork["IPv4 Address"];
    } else {
      userInput.network = active[0]["IPv4 Address"];
    }

    userInput.memory = userInput.memory * 1024;
    userInput.storage = userInput.storage * 1024;

    const hostOnly = await listHostOnlyIfs();
    const hostNetwork = hostOnly[0]["Name"];
    const vdi = `${userVMs}\\${userInput.name}\\${userInput.name}.vdi`;

    await exec(
      `${create} "${VBoxManage}" ${userInput.name} ${userInput.network} "${hostNetwork}" ${userInput.memory} ${userInput.processors} "${vdi}" ${userInput.storage} "${iso}"`
    );
  } catch (e) {
    console.error(e);
  }
};
