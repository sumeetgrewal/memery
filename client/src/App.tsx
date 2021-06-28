import * as React from "react";
import { Player } from '../../server/src/models/player.model'
import Home from "./components/Home";
import Join from "./components/Join";
import Lobby from "./components/Lobby"

interface AppState {
  gameState: string,
  playerState: {
    isJoined: boolean,
    isConnected: boolean,
  }
  gameId: string,
  players: {
    [username: string] : Player
  },
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      gameState: "setup",
      playerState: {
        isJoined: false,
        isConnected: false,
      },
      gameId: "",
      players: {},
    }

    this.setGameId = this.setGameId.bind(this);
    this.setJoined = this.setJoined.bind(this);
    this.connectGame = this.connectGame.bind(this);
  }

  async connectGame() {
    const { gameId, playerState: { isConnected }} = this.state;
    if (!isConnected) {
      const connection = new EventSource(`/game/${gameId}/connect`)

      connection.addEventListener('joined', (event: any) => {
        console.log(event.data)
      })
    }
  }

  setGameId(gameId: string): Promise<void> {
    return Promise.resolve(this.setState({gameId}));
  }
  
  setJoined() : Promise<void> {
    return Promise.resolve(this.setState({playerState: {
      ...this.state.playerState,
      isJoined: true
    }}))
  }

  renderGameStage() {
    const { gameState, gameId, playerState, players } = this.state;

    if (gameState === "setup") {
      if (gameId === "") return <Home setGameId={this.setGameId}/>
      else if (!playerState.isJoined) return <Join gameId={gameId} setJoined={this.setJoined}/>
      else return <Lobby connectGame={this.connectGame} gameId={gameId} players={players} />
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
