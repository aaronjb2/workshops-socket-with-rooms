import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3007");

class App extends Component {
  constructor() {
    super();
    this.state = {
      joined: false,
      name: "",
      message: "",
      messages: [],
      watchers: 0
    };
    socket.on("watcher-added", data => {
      this.setState(() => {
        let tempMessages = [...this.state.messages];
        tempMessages.push(`Someone is watching...`);
        return { messages: tempMessages };
      });
    });
    socket.on("joined-chat", data => {
      this.setState(() => {
        let tempMessages = [...this.state.messages];
        tempMessages.push(`${data} has joined the chat`);
        return { messages: tempMessages };
      });
    });

    socket.on("message-received", data => {
      this.setState(() => {
        let tempMessages = [...this.state.messages];
        tempMessages.push(`${data.name} says: ${data.message}`);
        return { messages: tempMessages };
      });
    });
  }

  joinChat() {
    this.setState({ joined: true });
    socket.emit("join-chat", { name: this.state.name });
  }

  sendMessage() {
    socket.emit("send-message", {
      name: this.state.name,
      message: this.state.message
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.messages.map((val, i) => {
          return (
            <div key={i}>
              <h3>{val}</h3>
            </div>
          );
        })}
        {!this.state.joined ? (
          <div>
            <input
              placeholder="username"
              onChange={e => this.setState({ name: e.target.value })}
            />
            <button onClick={() => this.joinChat()}>Submit</button>
          </div>
        ) : (
          <div>
            <input
              placeholder="send message"
              onChange={e => this.setState({ message: e.target.value })}
            />
            <button onClick={() => this.sendMessage()}>Send</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
