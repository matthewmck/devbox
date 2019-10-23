const inquirer = require(`inquirer`);
const { promptQuestions } = require(`./options.template`);

module.exports = async function(values) {
  const list = promptQuestions;
  const questions = [];
  let userInput;

  for (const value of values) {
    questions.push(list[value]);
  }

  await inquirer.prompt(questions).then(answers => {
    userInput = answers;
  });

  return userInput;
};
