const options = require(`./options.init`);
const prompt = require(`./options.prompt`);

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

  vm.memory = options.memory.GBtoMB(vm.memory);
  vm.storage = options.storage.GBtoMB(vm.storage);

  console.log(vm);
};
