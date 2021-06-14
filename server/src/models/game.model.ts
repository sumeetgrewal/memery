import { gameServer } from "./gameServer.model";
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

    startGame() {
        this.status = 'game';
        this.sendGameUpdate();
    }

    sendPlayerUpdate() {
        pushUpdateToPlayers(this.gameId, JSON.stringify({players: this.players}), 'playerUpdate', Object.keys(this.players));
    }

    sendGameUpdate() {
        pushUpdateToPlayers(this.gameId, JSON.stringify({status: this.status}), 'gameUpdate', Object.keys(this.players));
    }
    
    addClient(username:string, client: any) {
        if (this.players[username]) {
            this.players[username].client = client;
        }
    }
}

// export function pushUpdateToPlayers(data: string, event: string = 'message', clients: any[]) {
//     clients.forEach((client: any) => {
//         if (client) {
//             client.write(`id: ${sseID++}\n`);
//             client.write(`event: ${event}\n`);
//             client.write(`data: ${data}\n\n`);
//             client.flush();
//         }
//     });
// }

export function pushUpdateToPlayers(gameId: string, data: string, event: string = 'message', usernames: string[]) {
    const game: Game = gameServer.games[gameId];
    usernames.forEach((username: any) => {
        const client: any = game?.players[username]?.client;
        if (client) {
            client.write(`id: ${sseID++}\n`);
            client.write(`event: ${event}\n`);
            client.write(`data: ${data}\n\n`);
            client.flush();
        }
    });
}
