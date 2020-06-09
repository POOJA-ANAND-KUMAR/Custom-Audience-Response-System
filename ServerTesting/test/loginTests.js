/*
  Tests for:
  * admin login, 
  * setting up course which includes setting student passwords
  * student login

*/
const assert = require("chai").assert;
const rp = require("request-promise-native");

const localTest = true;
let adminPass, studentPass, baseUrl, wsUrl;

if (localTest) {
  adminPass = "1234";
  studentPass = "2345";
  baseUrl = "http://localhost:8999/";
  wsUrl = "ws://localhost:8999/myws";
} else {
  // Testing deployed server
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

let studentLogin = {
  uri: baseUrl + "login/",
  method: "POST",
  resolveWithFullResponse: true,
  json: true,
  body: { name: "A_Student", password: studentPass },
};

let setCourse = {
  uri: baseUrl + "setCourse/",
  method: "POST",
  resolveWithFullResponse: true,
  json: true,
  body: { name: "CS351", password: studentPass, enabled: true },
};

describe("Server login Tests", function () {
  it("Good admin login", async function () {
    let res = await rp(adminLogin);
    // console.log(JSON.stringify(res));
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.role, "admin");
  });

  it("Bad admin login", async function () {
    let badAdminLogin = Object.assign({}, adminLogin, {
      body: { name: "DrB", password: "NotThePW!" },
    });
    try {
      let res = await rp(badAdminLogin);
      assert.fail("Should have errored!");
    } catch (e) {
      // console.log(JSON.stringify(e));
      assert.equal(e.response.statusCode, 401);
      assert.equal(e.response.body.error, true);
    }
  });

  describe("Set course tests", function () {
    let loginCookie = "";
    before(async function () {
      let res = await rp(adminLogin);
      loginCookie = res.headers["set-cookie"][0];
      // console.log(`Cookie: ${loginCookie}`);
    });

    it("Set course to CS351", async function () {
      setCourse.headers = { Cookie: loginCookie };
      res = await rp(setCourse);
      // console.log(`Set course result: ${JSON.stringify(res.body)}`);
      assert.equal(res.body.course, "CS351");
    });

  });

  describe("Student Login Tests", function() {

    before(async function(){
      let res = await rp(adminLogin);
      let loginCookie = res.headers["set-cookie"][0];
      setCourse.headers = { Cookie: loginCookie };
      res = await rp(setCourse);
    })

    it("Good Student login Test", async function () {
      let res = await rp(studentLogin);
      console.log(JSON.stringify(res));
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.role, "student");
    });

    it("Bad Student login Test", async function () {
      studentLogin.body.password = "Not The Password!";
      try {
        let res = await rp(studentLogin);
        assert.fail("Should have errored!");
      } catch (e) {
        // console.log(JSON.stringify(e));
        assert.equal(e.response.statusCode, 401);
        assert.equal(e.response.body.error, true);
      }
    });
  })
})
