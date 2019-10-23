const network = require("network");

network.get_active_interface((err, obj) => {
  if (err) {
    console.log(err);
  }
  console.log(obj);
});

module.exports = {
  activeInterface: network.get_active_interface((err, obj) => {
    if (err) {
      console.log(err);
    }
    console.log(obj);
  })
};
