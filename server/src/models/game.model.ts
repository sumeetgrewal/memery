// model for a single game
const JWTHandlers = require('../middleware/jwt.authorization')
let sseID = 2;

interface GameModel  {
    gameCode: string,
    status: string,
    players: {
        [username: string] : Player
    },
}

interface PlayerModel {
    id: number,
    username: string,
    client: any,
}

export class Player implements PlayerModel {
    id=0;
    username = "";
    client = undefined;
    constructor(username: string, id: number) {
        this.username = username;
        this.id = id;
    }
}

export class Game implements GameModel {
    gameCode = ""; 
    players: {
        [username: string] : Player
    } = {};
    status = "setup" // setup OR game

    constructor(gameCode: string) {
        this.gameCode = gameCode;
    }

    addPlayer(username: string) {
        this.players[username] = new Player(username, Object.keys(this.players).length+1)
        pushUpdateToPlayers( JSON.stringify({players: this.players}), 'playerUpdate', this.getClients());
        return JWTHandlers.createToken(username);
    }

    getClients() {
        return Object.values(this.players).map((p: Player) => {if (p.client) return p.client})
    }
}

export function pushUpdateToPlayers(data: string, event: string = 'message', clients: any[]) {
    clients.forEach((client: any) => {
        if (client) {
            client.res.write(`id: ${sseID++}\n`);
            client.res.write(`event: ${event}\n`);
            client.res.write(`data: ${data}\n\n`);
            client.res.flush();
        }
    });
}

export const gameServer: {[code: string] : Game } = {};
