// model for a single game

interface GameModel  {
    gameCode: string,
    status: string,
    players: {
        [id: number] : Player
    },

}

interface Player {
    username: string,
}

export class Game implements GameModel {
    gameCode = ""; 
    players = {};
    status = "setup"

    constructor(gameCode: string) {
        this.gameCode = gameCode;
    }
}
