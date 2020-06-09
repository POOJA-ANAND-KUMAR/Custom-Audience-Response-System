// Server Run file for WebFaction deployment
const app = require('./classroomServer.js');

port = 21146; // Use  for WebFaction
app.listen(port, function () {
console.log(`Classroom Server listening on Port: ${port}`);
});