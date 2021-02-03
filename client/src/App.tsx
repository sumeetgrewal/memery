import * as React from "react";
import { Player } from '../../server/src/models/player.model'
import Home from "./components/Home";

interface AppState {
  status: string
  players: {
    [username: string] : Player
  },
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      status: "setup",
      players: {},
    }
  }


  renderGameStage() {
    const { status } = this.state;

    if (status === "setup") {
      return <Home />
    }

    return (
      <div>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        {this.renderGameStage()}
      </div>
    );
  }
}
