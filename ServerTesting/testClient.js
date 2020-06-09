/*  Minimal Test Client to be used with the `classroomServer.js`

    This test client runs in Node.js and has the following functionality:

    1. Logs into the classroomServer.js with a name and password
    2. Grabs the return "session" cookie
    3. Uses the "session" cookie in WebSockets upgrade request so that the
    server will open the socket
    4. Sends/Receives simple test message.

*/
const WebSocket = require('ws');
const rp = require('request-promise-native');

let login = {
    uri: 'http://localhost:8999/login/',
    method: 'POST',
    resolveWithFullResponse: true,
    json: true,
    body: {name: "DrB", password: "1234"}
    // jar: j
};

let loginCookie = "";

rp(login).then(res => {
    console.log(`Path "/": ${JSON.stringify(res)}`);
    loginCookie = res.headers["set-cookie"][0];
    console.log(`Cookie: ${loginCookie}`);
}).catch(reason =>{
    console.log(`Some kind of error: ${reason}`);
}).then(function(){
    console.log('Trying web socket');
    let options = {headers: {
        'Cookie': loginCookie
    }};
    const ws = new WebSocket('ws://localhost:8999/myws', options);
    
    ws.on('open', function open() {
        let message = {
            type: "textMessage",
            to: "all",
            content: "Hello Websockets from the Test client!"
          };
        ws.send(JSON.stringify(message));
    });
    
    ws.on('message', function incoming(data) {
      console.log(data);
    });
    
    ws.on('close', function (code, reason) {
        console.log(`Websocket closed: ${code}, ${reason}`);
    });
    
    ws.on('error', function (reason) {
        console.log(`Websocket error: ${reason}`);
    });
})
console.log("Starting my web requests:");

