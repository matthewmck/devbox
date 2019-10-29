const { exec } = require("./child_process.utils");
const { VBoxManage } = require("../../devbox.config");
const { isOBJEmpty } = require("./obj.utils");
const Enum = {
  NAME: "Name",
  DEFAULTGATEWAY: "Default Gateway",
  IPV6: "IPv6"
};

async function listInterfaces() {
  try {
    stdout = await exec("ipconfig");
    all = parseIPConfig(stdout);
    active = activeInterface(all);
    return { all, active };
  } catch (e) {
    return Promise.reject(e);
  }
}

async function listHostOnlyIfs() {
  try {
    const stdout = await exec(`"${VBoxManage}" list hostonlyifs`);
    const ifs = parseHostOnlyIfs(stdout);
    return ifs;
  } catch (e) {
    return Promise.reject(e);
  }
}

async function hostInfo() {
  try {
    const stdout = await exec(`"${VBoxManage}" list hostinfo`);
    const info = parseHostInfo(stdout);

    return info;
  } catch (e) {
    return Promise.reject(e);
  }
}

function parseHostInfo(stdout) {
  const lines = stdout.split("\r\n");
  let obj = {};

  lines.forEach(line => {
    if (line === "") return;

    const childArr = line.split(":");
    const value = childArr[1].trim();

    switch (childArr[0]) {
      case 'Processor count':
        const cpu = Number(value) / 2
        obj = { ...obj, maxCPU: cpu };
        return;
      case 'Memory size':
        const strValue = value.split(' ');
        const ram = Math.floor((Number(strValue[0]) / 1024) / 2)
        obj = { ...obj, maxRAM: ram };
      default:
        return;
    }
  });

  obj = {
    ...obj,
    minCPU: 1,
    minRAM: 1,
    minStorage: 2
  }

  return obj;
}

function parseHostOnlyIfs(stdout) {
  const lines = stdout.split("\r\n");
  const arr = [];
  let obj = {};

  lines.forEach(line => {
    if (line.includes("IPV6") || line.includes("HardwareAddress")) {
      return;
    }

    if (line === "") {
      if (!isOBJEmpty(obj)) {
        arr.push(obj);
        obj = {};
      }
      return;
    }

    const childArr = line.split(":");
    const key = childArr[0].trim();
    const value = childArr[1].trim();

    obj = { ...obj, [key]: value };
  });

  if (!isOBJEmpty(obj)) arr.push(obj);
  return arr;
}

// Expects parseIPConfig obj
function activeInterface(ipInfo) {
  const active = ipInfo.filter(interface => {
    if (interface.hasOwnProperty(Enum.DEFAULTGATEWAY)) {
      if (interface[Enum.DEFAULTGATEWAY] !== "") return true;
    }
    return false;
  });
  return active;
}

function parseIPConfig(stdout) {
  const lines = stdout.split("\r\n");
  const arr = []; // first pass
  const result = []; // final pass
  let obj = {}; // final pass - cat by network interface

  // First pass - parse through ipconfig string
  lines.forEach((line, i) => {
    // Ignore all instances of IPv6
    if (line.includes(Enum.IPV6)) return;
    /*
      no more than 2 items should be in an arr.
      If multiple exist then arr contains IPv6 addr.
      Grab label for line and place in arr2 as a single arr item
    */
    const childArr = line.split(":");
    if (childArr.length > 2) {
      arr.push([childArr[0]]);
      return;
    }
    if (i !== 0 && i !== lines.length - 1) {
      // get name for network interfaces
      if (lines[i - 1] === "" && lines[i + 1] === "") {
        arr.push([Enum.NAME, childArr[0]]);
        return;
      }
      // Add items with no label to the left to previous child arr
      else if (
        childArr.length === 1 &&
        lines[i - 1] !== "" &&
        lines[i + 1] === ""
      ) {
        const lastIndex = arr.length - 1;
        arr[lastIndex].push(childArr[0]);
        return;
      }
    }

    arr.push(childArr);
  });

  // Final pass - rm empty child arr, trim arr values, catogrize by network interface
  arr.forEach(childArr => {
    // ignore spaces
    if (childArr.length === 1) return;

    const key = childArr[0].replace(/\./g, "").trim();
    const value = childArr[1].trim();

    // If new network interface create new obj
    if (key === Enum.NAME) {
      if (!isOBJEmpty(obj)) {
        result.push(obj);
        obj = {};
      }

      obj = { ...obj, [key]: value };
      return;
    }

    obj = { ...obj, [key]: value };
  });

  return result;
}

module.exports = {
  listInterfaces,
  listHostOnlyIfs,
  hostInfo
};
