import { Player } from "./player.model";

const JWTHandlers = require('../middleware/jwt.authorization')
let sseID = 2;

interface GameModel  {
    gameId: string,
    status: string,
    players: {
        [username: string] : Player
    },
}

export class Game implements GameModel {
    gameId = ""; 
    players: {
        [username: string] : Player
    } = {};
    status = "setup" // setup OR game

    constructor(gameId: string) {
        this.gameId = gameId;
    }

    addPlayer(username: string) {
        this.players[username] = new Player(username, Object.keys(this.players).length+1)
        this.sendPlayerUpdate();
        return JWTHandlers.createToken(username);
    }

    removePlayer(username: string) {
        if (this.players[username]) delete this.players[username];
        this.sendPlayerUpdate();
    }

    getClients() {
        return Object.values(this.players).map((p: Player) => {if (p.client) return p.client})
    }

    startGame() {
        this.status = 'game';
        this.sendGameUpdate();
    }

    sendPlayerUpdate() {
        pushUpdateToPlayers(JSON.stringify({players: this.players}), 'playerUpdate', this.getClients());
    }

    sendGameUpdate() {
        pushUpdateToPlayers(JSON.stringify({status: this.status}), 'gameUpdate', this.getClients());
    }
}

export function pushUpdateToPlayers(data: string, event: string = 'message', clients: any[]) {
    clients.forEach((client: any) => {
        if (client) {
            client.write(`id: ${sseID++}\n`);
            client.write(`event: ${event}\n`);
            client.write(`data: ${data}\n\n`);
            client.flush();
        }
    });
}
