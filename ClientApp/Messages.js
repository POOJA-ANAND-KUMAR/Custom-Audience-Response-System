import React, { Component } from "react";

class Messaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessage: ""
    };
  }

  onInput(event) {
    this.setState({ sendMessage: event.target.value });
  }

  send() {
    let message = {
      type: "textMessage",
      to: "all",
      content: this.state.sendMessage
    };
    this.props.ws.send(JSON.stringify(message));
    this.setState({ sendMessage: "" });
  }

  render() {
    let messages = this.props.recMessages.map(function(m, i) {
      return (
        <p key={i}>
          <strong>{i + 1}</strong>. {m}
        </p>
      );
    });
    messages.reverse();
    return (
      <div id="Messages">
        <h2>Messages</h2>
        <section id="SendMessage">
          <h2>Send a Message</h2>
          <textarea
            onChange={this.onInput.bind(this)}
            value={this.state.sendMessage}
          />
          <button onClick={this.send.bind(this)}>Send Message</button>
        </section>
        <section id="RecMessages">
          <h2>Received Messages</h2>
          {messages}
        </section>
      </div>
    );
  }
}

export default Messaging;
