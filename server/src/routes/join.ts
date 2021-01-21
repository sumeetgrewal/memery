import { gameServer } from "../models/gameServer.model";

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

    if (!Object.keys(gameServer).includes(gameId)) {
        return res.status(404).json({status: "Error", message: "Game Does Not Exist"})
    }

    const game = gameServer[gameId];
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
router.route('/:gameId').put((req: any, res: any) => {

})

/*
Any User selects Start game

    if all players are ready, start game
    return 200
    send update to players

*/
router.route('/:gameId/start').get((req: any, res: any) => {

})

module.exports = router;
