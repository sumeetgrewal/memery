import { gameServer } from '../models/gameServer.model';
import { Player } from '../models/player.model';
let JWTHandlers = require('../middleware/jwt.authorization');

const router = require('express').Router({ mergeParams: true});
const MAX_PLAYERS = 8;

/*
User selects 'Join'

    if game does not exist, return 300
    if game is in progress, return 403
    if username is taken, return 400
    if game is full, return 400
    if player can be created, return 200
*/
router.route('/').post((req: any, res: any) => {
    const { username } = req.body;
    const { gameId } = req.params;

    if (!Object.keys(gameServer.games).includes(gameId)) {
        return res.status(404).json({status: "Error", message: "Game Does Not Exist"})
    }

    const game = gameServer.games[gameId];
    const playerNames = Object.keys(game.players);

    if (game.status !== "setup") {
        return res.status(400).json({status: "Error", message: "Game is in progress"})
    }
    if (playerNames.length > MAX_PLAYERS) {
        return res.status(401).json({status: "Error", message: "Game is full"});
    }
    if (playerNames.includes(username)) {
        return res.status(400).json({status: "Error", message: "Username is already taken"})
    }

    const token: any = game.addPlayer(username);
    res.status(200).json({status: 'Success', token});
}) 

/*
User selects I'm Ready

    check token
    return 200  
    send update to players

*/
router.route('/').put((req: any, res: any) => {
    const decodedToken: any = JWTHandlers.checkToken(req)
    const { gameId } = req.params;

    if (!decodedToken) { 
        return res.status(400).json({ status: 'Error', message: 'Invalid token'});
    } else if (!Object.keys(gameServer.games).includes(gameId)) {
        return res.status(404).json({status: "Error", message: "Game Does Not Exist"})
    }

    const game = gameServer.games[gameId];
    const { username } = decodedToken;

    if (game.status !== "setup") {
        return res.status(400).json({status: "Error", message: "Game is in progress"})
    } else if (!game.players[username]) {
        return res.status(400).json({status: 'Error', message: 'Player does not exist'})
    } 

    game.players[username].status = "ready";
    game.sendPlayerUpdate();
    
    return res.status(200).json({status: 'Success'})
})

/*
User selects Exit

    return 200
    send update to players

*/
router.route('/').delete((req: any, res: any) => {
    // TODO M2
    const decodedToken: any = JWTHandlers.checkToken(req)
    const { gameId } = req.params;

    if (!decodedToken) { 
        return res.status(400).json({ status: 'Error', message: 'Invalid token'});
    } else if (!Object.keys(gameServer.games).includes(gameId)) {
        return res.status(404).json({status: "Error", message: "Game Does Not Exist"})
    }

    const game = gameServer.games[gameId];
    const { username } = decodedToken;

    if (!game.players[username]) {
        return res.status(400).json({status: 'Error', message: 'Player does not exist'})
    } 

    game.removePlayer(username);

    return res.status(200).json({status: 'Success'})
})

/*
Any User selects Start game

    if all players are ready, start game
    return 200
    send update to players

*/
router.route('/start').get((req: any, res: any) => {
    const decodedToken: any = JWTHandlers.checkToken(req)
    const { gameId } = req.params;

    if (!decodedToken) { 
        return res.status(400).json({ status: 'Error', message: 'Invalid token'});
    } else if (!Object.keys(gameServer.games).includes(gameId)) {
        return res.status(404).json({status: "Error", message: "Game Does Not Exist"})
    }

    const game = gameServer.games[gameId];
    const ready = Object.entries(game.players).every((player: [string, Player]) => {
        return player[1].status==="ready"
    })

    if (ready) {
        game.startGame();
        return res.status(200).json({status: 'Success'});
    } else {
        return res.status(403).json({status: "Error", message: "Not all players are ready"})
    }
})

module.exports = router;
