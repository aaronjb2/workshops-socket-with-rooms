import React from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3007");

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };

    socket.on("client-listener", data => {
      console.log(data);
    });
  }

  sendSocketMessage() {
    socket.emit("workshop-socket-listener", { name: this.state.name });
  }

  render() {
    return (
      <div>
        <input
          onChange={e => this.setState({ name: e.target.value })}
          placeholder="name"
        />
        <button onClick={() => this.sendSocketMessage()}>Submit</button>
      </div>
    );
  }
}
