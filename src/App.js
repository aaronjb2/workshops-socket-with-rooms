import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

// Sockets have traditionally been the solution around which most realtime chat systems are architected,
// providing a bi-directional communication channel between a client and a server.
// This means that the server can push messages to clients. Whenever you write a chat message,
// the idea is that the server will get it and push it to all other connected clients.

//Socket.IO is composed of two parts:

//A server that integrates with (or mounts on) the Node.JS HTTP Server: socket.io
//A client library that loads on the browser side: socket.io-client

// Need to initially tell the socket what server it will be listening to, when hosted, you'll erase the http://localhost:3007 because the server will be serving static files
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
      room: ""
    };

    ///////////////////global chat/////////////////////////////////////
    socket.on("all-users", data => {
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
    //////////////////////////////////////////////////////////////////

    /////////////////////// room chat /////////////////////////////

    socket.on("room-message-received", data => {
      let tempMessages = [...this.state.roomMessages];
      tempMessages.push(data.message);
      this.setState({ roomMessages: tempMessages });
    });

    socket.on("send-room-message-received", data => {
      this.setState(() => {
        let tempMessages = [...this.state.roomMessages];
        tempMessages.push(data.message);
        return { roomMessages: tempMessages };
      });
    });
    ////////////////////////////////////////////////////////////
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
    // because we'll be sending it to a specific room, we need to pass what room it will be going to
    socket.emit("send-room-message", {
      name: this.state.name,
      room: this.state.room,
      message: this.state.roomMessage
    });
  }

  render() {
    return (
      <div className="App">
        {/* Global Chat */}
        <div className="chat-box">
          {this.state.messages.map((val, i) => {
            return (
              <div key={i}>
                <h3>{val}</h3>
              </div>
            );
          })}
          {/* Changes input and buttons based on whether they've initially joined */}
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

        {/* Room Chat */}
        <div className="chat-box">
          {this.state.roomMessages.map((val, i) => {
            return (
              <div key={i}>
                <h3>{val}</h3>
              </div>
            );
          })}
          {/* Changes based on whether they've joined a room or not */}
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
