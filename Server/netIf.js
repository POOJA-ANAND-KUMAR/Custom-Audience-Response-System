// A simple program to look at IPv4 addresses
// for network interface via Node.js
const os=require('os');
let networkInterfaces = os.networkInterfaces();
// console.log(networkInterfaces); // Shows everything
for (let intf in networkInterfaces){
    console.log(intf);
    // Only interested in IPv4 interfaces
    let addresses = networkInterfaces[intf]
        .filter(a => a.family === 'IPv4');
    console.log(addresses);
}
