const childProcess = require("child_process");

function exec(cmd) {
    return new Promise((res, rej) => {
        childProcess.exec(cmd, (err, stdout, stderr) => {
            if (err || stderr) {
                rej(new Error(err || stderr));
            }
            res(stdout);
        })
    })
}

module.exports = {
    exec
}