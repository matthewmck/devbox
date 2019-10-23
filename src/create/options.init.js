const Enum = {
  STRING: `string`,
  NUM: `number`
};

class Option {
  constructor(alias, desc, type) {
    this.alias = alias;
    this.desc = desc;
    this.type = type;
  }

  validate(input) {
    switch (this.type) {
      case Enum.STRING:
        return typeof input === Enum.STRING;
      case Enum.NUM:
        return !isNaN(input);
      default:
        return console.error(`Unable to validate input`);
    }
  }

  GBtoMB(input) {
    if (this.type === Enum.NUM) {
      return input * 1024;
    }
  }
}

module.exports = {
  name: new Option(`n`, `Name of the VM`, Enum.STRING),
  processor: new Option(`p`, `processor(s)`, Enum.NUM),
  memory: new Option(`m`, `Memory size (GB)`, Enum.NUM),
  storage: new Option(`s`, `Storage size (GB)`, Enum.NUM)
};
