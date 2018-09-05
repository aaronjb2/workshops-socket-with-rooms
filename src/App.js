import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3007");

class App extends Component {
  constructor() {
    super();
    this.state = {
      joined: false,
      roomJoined: false,
      name: "",
      message: "",
      roomMessage: "",
      messages: [],
      roomMessages: [],
      room: "",
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
    socket.on("room-message-received", data => {
      this.setState(() => {
        let tempMessages = [...this.state.roomMessages];
        tempMessages.push(data.message);
        return { roomMessages: tempMessages };
      });
    });
    socket.on("send-room-message-received", data => {
      this.setState(() => {
        let tempMessages = [...this.state.roomMessages];
        tempMessages.push(data.message);
        return { roomMessages: tempMessages };
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

  joinRoom() {
    this.setState({ roomJoined: true });
    socket.emit("join-room", { room: this.state.room });
  }

  sendRoomMessage() {
    socket.emit("send-room-message", {
      name: this.state.name,
      room: this.state.room,
      message: this.state.roomMessage
    });
  }

  render() {
    return (
      <div className="App">
        <div className="chat-box">
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

        <div className="chat-box">
          {this.state.roomMessages.map((val, i) => {
            return (
              <div key={i}>
                <h3>{val}</h3>
              </div>
            );
          })}
          {!this.state.roomJoined ? (
            <div>
              <input
                placeholder="join a room"
                onChange={e => this.setState({ room: e.target.value })}
              />
              <button onClick={() => this.joinRoom()}>Join Room</button>
            </div>
          ) : (
            <div>
              <input
                placeholder="send message"
                onChange={e => this.setState({ roomMessage: e.target.value })}
              />
              <button onClick={() => this.sendRoomMessage()}>Send</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
