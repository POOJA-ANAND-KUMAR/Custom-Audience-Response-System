/*
    Checks the administrators password that has been set with
    setAdmin.js
*/
const readlineSync = require('readline-sync');
const bcrypt = require('bcryptjs');
const adminInfo = require('./adminInfo.json');

console.log('The admin name is: ' + adminInfo.name);
 
// Handle the secret text (e.g. password).
let password = readlineSync.question("Admin password? ", {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
let result = bcrypt.compareSync(password, adminInfo.passHash); 
console.log('admin password verified: ' + result);

  