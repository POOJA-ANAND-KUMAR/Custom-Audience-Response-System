const session = require("express-session");
const NedbStore = require("nedb-session-store")(session);
const express = require("express");
const http = require("http");
const bcrypt = require("bcryptjs");
const mh = require("./messageHandling");

const adminInfo = require("./adminInfo.json");
let classroomInfo = { course: "CS351-1", passHash: "", enabled: false };

const WebSocket = require("ws");

const app = express();

// We keep track of info on logged in users and their websocket
// in the following map. It is indexed by the session.id. Note that a user may
// be logged in but not have a websocket assigned (for a short time).
const userMap = new Map();

const cookieName = "DrBsClassroom";

//
// We need the same instance of the session parser in express and
// WebSocket server.
//

const sessStore = new NedbStore({
  inMemoryOnly: true,
});

const sessionParser = session({
  secret: "CSUEB Spring 2030",
  resave: false,
  saveUninitialized: false,
  name: cookieName,
  store: sessStore,
});

// BEGIN: HTTP request processing portion of server
app.use(express.static("public")); // To deliver App
app.use(sessionParser);
app.use(function (req, res, next) {
  //	console.log(`session object: ${JSON.stringify(req.session.user)}`);
  //	console.log(`session id: ${req.session.id}`);
  //  console.log("Server heard something!");
  if (!req.session.user) {
    req.session.user = { role: "guest" };
  }
  next();
});

function checkAdminMiddleware(req, res, next) {

  if (req.session.user.role !== "admin") {
    res.status(401).json({ error: "Not permitted" });
  } else {
    next();
  }
}

app.post("/login", express.json(), async function (req, res) {
  console.log("Login was called!!!");
  console.log(req.body);
  let name = req.body.name;
  let password = req.body.password;
  let userInfo = null;
  let passHash = null;
  if (name !== adminInfo.name) {
    userInfo = { name: name, role: "student" };
    passHash = classroomInfo.passHash;
  } else {
    userInfo = { name: name, role: "admin" };
    passHash = adminInfo.passHash;
  }

  let verified = bcrypt.compareSync(password, passHash);
  if (verified) {
    console.log(`session id before login: ${req.session.id}`);
    // Upgrade in priveledge, should generate new session id
    // Save old session information if any, create a new session
    let oldInfo = req.session.user;
    req.session.regenerate(function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`session id after regenerate login: ${req.session.id}`);
      req.session.user = Object.assign(oldInfo, userInfo);
      res.json(userInfo);
    });
  } else {
    res.status(401).json({
      error: true,
      message: "User/Password error",
    });
  }
});

app.get("/logout", function (req, res) {
  let options = req.session.cookie;
  let userInfo = userMap.get(req.session.id);
  console.log(`User ${userInfo.name} logged out`);
  userMap.delete(req.session.id);
  req.session.destroy(function (err) {
    userInfo.ws.close();
    if (err) {
      console.log(err);
    }
    res.clearCookie(cookieName, options); // the cookie name and options
    res.json({ message: "Goodbye" });
  });
});

// Allows an administrator to set the course name and a course wide password
app.post("/setCourse", checkAdminMiddleware, express.json(), function (
  req,
  res
) {
  console.log("setCourse was called!!!");
  console.log(req.body);
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  classroomInfo = {
    course: req.body.name,
    enabled: req.body.enabled,
    passHash: hash,
  };
  console.log(classroomInfo);
  res.json(classroomInfo);
});

app.get("/course", function (req, res) {
  res.json({ course: classroomInfo.course, enabled: classroomInfo.enabled });
});

// END: HTTP request processing portion of server

// BEGIN: WebSocket processing portion of server

const server = http.createServer(app); // Create HTTP server by ourselves.
const wss = new WebSocket.Server({ clientTracking: true, noServer: true });

server.on("upgrade", function (request, socket, head) {
  console.log("Parsing session from request...");
  sessionParser(request, {}, () => {
    if (!request.session.user) {
      request.session.user = { role: "guest", name: "unknown" };
    }
    console.log(`session object: ${JSON.stringify(request.session.user)}`);
    console.log(`session id: ${request.session.id}`);
    let role = request.session.user.role;
    let name = request.session.user.name;
    if (role != "admin" && role != "student") {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    console.log(`Allowing WebSocket for user: ${name}, role: ${role}`);
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit("connection", ws, request);
    });
  });
});

// Broken connection detection functions
function noop() {}
 
function heartbeat() {
  this.isAlive = true;
}


wss.on("connection", function (ws, req) {
  // broken connection detection
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  let userInfo = req.session.user;
  userInfo.ws = ws;
  console.log("WS information:");
  console.log(
    `Request IP: ${req.connection.remoteAddress}, ${req.connection.remotePort}`
  );
  let info = {
    address: req.connection.remoteAddress,
    port: req.connection.remotePort,
    origin: req.headers["x-forwarded-for"],
  };
  Object.assign(userInfo, info);
  // Here we finally add the user to the userMap, i.e., after they have a WS
  userMap.set(req.session.id, userInfo);
  mh.sendStatus(userMap);
  mh.sendWelcome(ws, userInfo, classroomInfo);

  ws.on("message", function (message) {
    mh.messageHandler(userInfo, userMap, message);
  });

  ws.on("close", function (code) {
    console.log(`socket closed to ${userInfo.name}, sessId: ${req.session.id}`);
    userMap.delete(req.session.id);
    sessStore.destroy(req.session.id, function (error) {
      console.log(`destroyed session for ${userInfo.name}`);
    });
    mh.sendStatus(userMap);
  });
});

// Broken connection detection currently using their
// "clients" list rather than our userMap
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
 
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
 
wss.on('close', function close() {
  clearInterval(interval);
});

module.exports = server;
