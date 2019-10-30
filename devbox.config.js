const path = require("path");

module.exports = {
  VBoxManage: path.join(process.env.VBOX_MSI_INSTALL_PATH, "VBoxManage.exe"),
  userVMs: path.join(process.env.USERPROFILE, "VirtualBox VMs"),
  create: path.join(__dirname, "/src/scripts/create.sh"),
  iso: path.join(__dirname, "/iso/ubuntu-18.04.3-live-server-amd64.iso"),
  defaults: {
    memory: 2,
    cpu: 1,
    storage: 15
  }
};
