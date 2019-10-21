const path = require('path');

module.exports = {
    VBoxManage: path.join(process.env.VBOX_MSI_INSTALL_PATH, 'VBoxManage.exe'),
    userVMs: path.join(process.env.USERPROFILE, 'VirtualBox VMs')
}