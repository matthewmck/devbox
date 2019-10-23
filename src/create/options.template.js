const options = require(`./options.init`);

function commandOptionsTemplate(options) {
  let obj = {};
  for (const key in options) {
    const prop = options[key];
    obj = {
      ...obj,
      [key]: {
        alias: prop.alias,
        describe: prop.desc,
        type: prop.type
      }
    };
  }

  return obj;
}

function promptTemplate(options) {
  let obj = {};
  for (const key in options) {
    const prop = options[key];
    obj = {
      ...obj,
      [key]: {
        name: key,
        message: prop.desc,
        validate: prop.validate.bind(options[key]),
        prefix: `>`,
        suffix: `:`
      }
    };
  }

  return obj;
}

module.exports = {
  commandOptions: commandOptionsTemplate(options),
  promptQuestions: promptTemplate(options)
};
