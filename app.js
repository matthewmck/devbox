// 1. create JSON file that grabs path to VBoxManage
// 2. within app.js, grab JSON file and value for VBoxManage
// 3. valudate if path to VBoxManage is valid, if not send error message to console
// 5. import yargs
// 6. create arg for create, grab VM name, cpus, and memory values from user
// 7. Create Shell script for vm creation process and pass in values
// 8. exec shell script from app.js

const VMConfig = require(`./devbox.config`);
const { version } = require(`./package.json`);
const fs = require(`fs`);
const yargs = require(`yargs`);
const inquirer = require(`inquirer`);

// if (fs.existsSync(path)) {
//     return true;
// }


yargs.version(version);

yargs.command({
    command: `create`,
    describe: `Create a new VM`,
    builder: {
        name: {
            alias: `n`,
            describe: `Name of the VM`,
            type: `string`
        },
        cpu: {
            alias: `c`,
            describe: `Number of processors`,
            type: `number`
        },
        memory: {
            alias: `m`,
            describe: `How much memory`,
            type: `number`
        }
    },
    handler(argv) { createVM(argv, Object.keys(this.builder)) }
});

function createVM(argv, options) {
    const vm = {};

    console.log(options)

    if (argv.name === '' || argv.name === undefined) {
        // prompt the user for name info
    } else {
        vm.name = argv.name;
    }

    if (argv.cpu === '' || argv.cpu === undefined) {
        // prompt the user for processor info
    } else {
        vm.cpu = argv.cpu;
    }

    if (argv.memory === '' || argv.memory === undefined) {
        // prompt the user for memory info
    } else {
        vm.memory = argv.memory;
    }
}

async function userInput() {
    const questions = [
        {
            name: "name",
            message: "Name of the VM",
            prefix: ">",
            suffix: ":"
        }
    ];
    let userInput = "";

    await inquirer.prompt(questions).then(answers => {
        userInput = answers;
    });

    console.log(userInput)
}

yargs.parse();
