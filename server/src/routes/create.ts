import { Game } from "../models/game.model";
import { gameServer } from "../models/gameServer.model";

const router = require('express').Router({ mergeParams: true});
// let JWTHandlers = require('../middleware/jwt.authorization')
const MAX_GAMES = 10;

/*
1. User selects 'Create New Game'

    if server has 10 games open, return 400 , gameServer full
    else create a new game code and return 200, gameId: 
*/
router.route('/').get((req: any, res: any) => {
    if (Object.keys(gameServer).length > MAX_GAMES) {
        return res.status(400).json({status: "Error", message: "Game server full"})
    }

    const gameId = createGame();
    return res.status(200).json({gameId})
}) 

/*
2. User enters a Game Code 
    
    req.body = {gameId: string}
    if game does not exist, return 401, Game does not exist
    if game is in progress, return 402, 
    if game exists, return 200, gameId
*/
router.route('/').post((req: any, res: any) => {
    const { gameId } = req.body;

    if (Object.keys(gameServer).indexOf(gameId) < 0) {
        return res.status(401).json({status: "Error", message: "Game does not exist"})
    } else if (gameServer[gameId].status !== "setup") {
        // redirect to rejoining endpoint
        return res.status(402).json({status: "Error", message: "Game is in progress"})
    }
    return res.status(200).json({gameId})
})

function generategameId() {
    return Math.random().toString(36).substr(2, 4);
}

function createGame(): string {
    let code = generategameId().toUpperCase()
    if (Object.keys(gameServer).indexOf(code) >= 0) return createGame();

    gameServer[code] = new Game(code);
    return code;
}

module.exports = router;
