/*  Multi Client Test to be used with the `classroomServer.js`

*/
const WebSocket = require("ws");
const rp = require("request-promise-native");

const createStudentsOnly = true;
const localTest = false;
let adminPass, studentPass, baseUrl, wsUrl;

if (localTest) {
  adminPass = "1234";
  studentPass = "2345";
  baseUrl = "http://localhost:8999/";
  wsUrl = "ws://localhost:8999/myws";
} else { // Testing deployed server
  adminPass = "GettingThere";
  studentPass = "HiClass";
  baseUrl = "https://classroom.grotto-networking.com/";
  wsUrl = "wss://classroom.grotto-networking.com/myws";
}

let adminLogin = {
  uri: baseUrl + "login/",
  method: "POST",
  resolveWithFullResponse: true,
  json: true,
  body: { name: "DrB", password: adminPass },
};

let setCourse = {
  uri: baseUrl + "setCourse/",
  method: "POST",
  resolveWithFullResponse: true,
  json: true,
  body: { name: "CSWhatever", password: studentPass, enabled: true },
};

async function createClients(numStudents) {
  try {
    if (!createStudentsOnly) {
      let loginCookie = "";
      let res = await rp(adminLogin);
      loginCookie = res.headers["set-cookie"][0];
      console.log(`Cookie: ${loginCookie}`);
      let adminWS = await createWS(loginCookie, "admin");
      setCourse.headers = { Cookie: loginCookie };
      res = await rp(setCourse);
      console.log(`Set course result: ${JSON.stringify(res.body)}`);
    }

    for (let i = 0; i < numStudents; i++) {
      let sname = `Student${i + 1}`;
      adminLogin.body = { name: sname, password: studentPass };
      res = await rp(adminLogin);
      loginCookie = res.headers["set-cookie"][0];
      ws = await createWS(loginCookie, sname);
    }
  } catch (err) {
    console.log(`Main loop error: ${err}`);
  }
}

async function createWS(loginCookie, name) {
  let options = {
    headers: {
      Cookie: loginCookie,
    },
  };
  const ws = new WebSocket(wsUrl, options);
  ws.on("open", function open() {
    let message = {
      type: "textMessage",
      to: "all",
      content: `Hello from ${name} Test client!`,
    };
    ws.send(JSON.stringify(message));
  });

  ws.on("message", function incoming(data) {
    console.log(data);
  });

  ws.on("close", function (code, reason) {
    console.log(`Websocket closed: ${code}, ${reason}`);
  });

  ws.on("error", function (reason) {
    console.log(`Websocket error: ${reason}`);
  });
}

console.log("Starting my web requests:");
createClients(10);
