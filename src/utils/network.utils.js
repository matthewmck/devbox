const { exec } = require('./child_process.utils');
const { isOBJEmpty } = require('./obj.utils');
const Enum = {
  NAME: "Name",
  DEFAULTGATEWAY: "Default Gateway",
  IPV6: "IPv6"
}

async function listInterfaces() {
  try {
    stdout = await exec("ipconfig");
    all = parseIPConfig(stdout);
    active = activeInterface(all);
    return { all, active }
  } catch (e) {
    return Promise.reject(e);
  }
}

// Expects parseIPConfig obj
function activeInterface(ipInfo) {
  const active = ipInfo.filter(interface => {
    if (interface.hasOwnProperty(Enum.DEFAULTGATEWAY)) {
      if (interface[Enum.DEFAULTGATEWAY] !== "") return true;
    }
    return false;
  })
  return active;
}

function parseIPConfig(stdout) {
  const lines = stdout.split("\r\n");
  const arr = [];     // first pass
  const result = [];  // final pass
  let obj = {};       // final pass - cat by network interface

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
  listInterfaces
}