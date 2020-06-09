const WebSocket = require("ws");

function messageHandler(userInfo, userMap, message) {
  console.log(`Received message ${message}`);
  console.log(`userInfo: ${JSON.stringify(userInfo)}`);
  console.log(`userMap: ${typeof userMap}`);
  //log the received message and send it back to the client
  console.log(
    `received message from ${userInfo.address}, port ${userInfo.port}, origin ${userInfo.origin}, name ${userInfo.name}`
  );
  console.log("received: %s", message);

  let parsed = JSON.parse(message);
  // TODO: check message against schema here
  parsed.from = userInfo.name;
  let dt = new Date();
  parsed.datetime = dt.toISOString();
  // Broadcast if appropriate
  if (parsed.to === "all") {
    userMap.forEach(function (info, sessId) {
      if (info.ws && userInfo.ws.readyState === WebSocket.OPEN) {
        info.ws.send(JSON.stringify(parsed));
      }
    });
  }
  // switch (parsed.type) {
  //   case "identification":
  //     clientMap.get(ws).id = parsed.content;
  //     break;
  //   default:
  //   // Other message processing here
  // }
}

module.exports.messageHandler = messageHandler;

function sendStatus(userMap, wss) {
  let dt = new Date();
  let statusUpdate = {
    version: 1,
    datetime: dt.toISOString(),
    type: "statusMessage",
    to: "you",
    from: "server",
    content: Array.from(userMap.values()),
  };
  // Remove the WebSocket information, turn into a string
  let statusString = JSON.stringify(statusUpdate, function (key, value) {
    if (key === "ws") {
      return undefined;
    } else {
      return value;
    }
  });
  console.log(statusString);
  // Send status update to clients
  userMap.forEach(function (info) {
    if (info.ws && info.ws.readyState === WebSocket.OPEN) {
      info.ws.send(statusString);
    }
  });
}

module.exports.sendStatus = sendStatus;

function sendWelcome(ws, userInfo, classroomInfo) {
  //send immediatly a feedback to the incoming connection
  let dt = new Date();
  let welcome = {
    version: 1,
    datetime: dt.toISOString(),
    type: "textMessage",
    to: userInfo.name,
    from: "server",
    content: "A websocket has been opened for you!",
    course: classroomInfo.course,
  };
  ws.send(JSON.stringify(welcome));
}

module.exports.sendWelcome = sendWelcome;