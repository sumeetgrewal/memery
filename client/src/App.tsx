import * as React from "react";
import { Player } from '../../server/src/models/player.model'
import Home from "./components/Home";
import Join from "./components/Join";

interface AppState {
  status: string,
  gameId: string,
  players: {
    [username: string] : Player
  },
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      status: "setup",
      gameId: "",
      players: {},
    }

    this.setGameId = this.setGameId.bind(this);
  }


  setGameId(gameId: string): Promise<void> {
    return Promise.resolve(this.setState({gameId}));
  }

  renderGameStage() {
    const { status, gameId } = this.state;

    if (status === "setup") {
      if (gameId === "") return <Home setGameId={this.setGameId}/>
      else return <Join />
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
