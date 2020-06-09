import React, { Component } from "react";
import config from "../configAddrPorts.json";
import Messaging from "./Messages";
import Login from "./Login";
import Status from "./Status";
import AdminCourse from "./AdminCourse";

class App extends Component {
  constructor(props) {
    super(props);
    console.log(config);
    this.state = {
      sockStatus: "Unknown",
      recMessages: [],
      latestStat: null,
      name: "",
      role: "guest",
      show: "status",
      course: ""
    };
  }

  setUpSocket() {
    console.log(config);
    // Need wss for classroom.grotto-networking.com and ws for local stuff...
    let wsURL = config.clientWsURL;
    console.log(`wsURL: ${wsURL}`);
    // 'ws://localhost:1234/myws'
    this.ws = new WebSocket(wsURL);
    this.ws.addEventListener("open", this.onWebSockOpen.bind(this));
    this.ws.addEventListener("message", this.onWebSockMessage.bind(this));
    this.ws.addEventListener("close", ()=>this.setState({role: "guest"}));
  }

  logout() {
    // this.ws.close(); // Here or server? Closing on server...
    this.setState({role: "guest"});
    fetch('/logout').then(function(response) {
      console.log('Request status code: ', response.statusText, response.status, response.type);
      return response.json();
    }).then(function(message) {
      console.log(message);
    });
  }

  setUser(userInfo) {
    if (userInfo.role !== "guest") {
      this.setUpSocket();
    }
    this.setState({ name: userInfo.name, role: userInfo.role });
  }

  setCourse(course) {
    this.setState({ course: course });
  }

  setShow(thing) {
    this.setState({ show: thing });
  }

  onWebSockOpen() {
    console.log("Websocket opened!");
    let message = {
      type: "textMessage",
      to: "all",
      content: "Hello Websockets from React!"
    };
    this.setState({ sockStatus: "Open" });
    this.ws.send(JSON.stringify(message));
  }

  onWebSockMessage(event) {
    console.log("React WebSocket message received:", event);
    let parsedData = JSON.parse(event.data);
    switch (parsedData.type) {
      case "textMessage":
        this.setState({
          recMessages: this.state.recMessages.concat(parsedData.content)
        });
        break;
      case "statusMessage":
        this.setState({ latestStat: parsedData.content });
        break;
      default:
        console.log("Unknown type of");
    }
  }

  render() {
    let contents = "";
    let nav = "";
    if (this.state.role === "guest") {
      contents = <Login setUser={this.setUser.bind(this)} />;
    } else {
      let menuItems = [
        <li>Logged in as: {this.state.name}</li>,
        <li>
          <a onClick={this.setShow.bind(this, "status")}>Status</a>
        </li>,
        <li>
          <a onClick={this.setShow.bind(this, "messaging")}>Messaging</a>
        </li>
      ];
      if (this.state.role === "admin") {
        menuItems.push(
          <li>
            <a onClick={this.setShow.bind(this, "adminCourse")}>Admin Course</a>
          </li>
        );
      }
      menuItems.push(
        <li>
        <a onClick={this.logout.bind(this)}>Logout</a>
      </li>
      );
      nav = (
        <nav>
          <ul>{menuItems}</ul>
        </nav>
      );
      switch (this.state.show) {
        case "status":
          contents = (
            <Status
              sockStatus={this.state.sockStatus}
              latestStat={this.state.latestStat}
            />
          );
          break;
        case "messaging":
          contents = (
            <Messaging recMessages={this.state.recMessages} ws={this.ws} />
          );
          break;
        case "adminCourse":
          contents = <AdminCourse setCourse={this.setCourse.bind(this)} />;
          break;
        default:
          contents = <h2>Something weird happenned!</h2>;
      }
    }
    return (
      <React.Fragment>
        {nav}
        <main>
          <h1>A custom audience response system (CARS)</h1>
          {contents}
        </main>
      </React.Fragment>
    );
  }
}

export default App;
