/*  Minimal Test Client to be used with the `classroomServer.js`

    This test client runs in Node.js and has the following functionality:

    1. Logs into the classroomServer.js with a name and password
    2. Grabs the return "session" cookie
    3. Uses the "session" cookie in WebSockets upgrade request so that the
    server will open the socket
    4. Sends/Receives simple test message.

*/
/*
    readln sample code from:
    https://nodejs.org/api/readline.html#readline_example_tiny_cli

*/
const readline = require('readline');
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
    let rl = null;

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
        rl = initCLI(ws);
    });
    
    ws.on('message', function incoming(data) {
      console.log(data);
      rl.prompt();
    });
    
    ws.on('close', function (code, reason) {
        console.log(`Websocket closed: ${code}, ${reason}`);
    });
    
    ws.on('error', function (reason) {
        console.log(`Websocket error: ${reason}`);
    });
})
console.log("Starting my web requests:");

function initCLI(ws) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'OHAI> '
      });
      
      rl.prompt();
      
      rl.on('line', (line) => {
        switch (line.trim()) {
          case 'hello':
            console.log('world!');
            break;
          default:
            console.log(`Say what? I might have heard '${line.trim()}'`);
            let message = {
                type: "textMessage",
                to: "all",
                content: line.trim()
              };
            ws.send(JSON.stringify(message));
            break;
        }
        rl.prompt();
      }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
      });
      return rl;
}

