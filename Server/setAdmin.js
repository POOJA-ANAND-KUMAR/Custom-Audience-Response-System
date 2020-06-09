/*
    A simple program to set the administrators name and password for
    use by the server.
*/
const readlineSync = require('readline-sync');
const bcrypt = require('bcryptjs');
const fs = require('fs');

 
// Wait for user's response.
let userName = readlineSync.question("Admin/Teacher's user name (one word)? ");
console.log('Hi ' + userName + '!');
 
// Handle the secret text (e.g. password).
let password = readlineSync.question("Admin password? ", {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync(password, salt);
console.log(userName + ' has password hash: ' + hash);
let adminInfo = {name: userName, passHash: hash, role: "admin"};
fs.writeFileSync('adminInfo.json', JSON.stringify(adminInfo, null, 2));
console.log('wrote adminInfo.json file')
  