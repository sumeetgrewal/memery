// Container for all games

import { Game } from "./game.model";

class GameServer {
    games: {[Id: string] : Game } = {}

    constructor() {
        this.games = {};
    }

    createGame(): string {
        let code = this.generateGameId().toUpperCase()
        if (Object.keys(GameServer).indexOf(code) >= 0) return this.createGame();
    
        this.games[code] = new Game(code);
        return code;
    }

    private generateGameId() {
        return Math.random().toString(36).substr(2, 4);
    }

}

export const gameServer = new GameServer();
