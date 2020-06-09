// Server Run file for Local deployment
const app = require('./classroomServer.js');
const config = require("../configAddrPorts.json");

//start our server
app.listen(config.wsPort, config.wsServer, () => {
    console.log(
      `Classroom Server started at ${config.wsServer}, port ${config.wsPort}.`
    );
  });
