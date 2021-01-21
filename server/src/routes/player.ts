import { gameServer } from "../models/gameServer.model";

const router = require('express').Router();
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
    const { username, gameCode } = req.body;

    if (!Object.keys(gameServer).includes(gameCode)) {
        return res.status(300).json({status: "Redirect", message: "Game Does Not Exist"})
    }

    const game = gameServer[gameCode];
    const playerNames = Object.keys(game.players);

    if (game.status !== "setup") {
        return res.status(400).json({status: "Error", message: "Game is in progress"})
    }
    if (playerNames.length > MAX_PLAYERS) {
        return res.status(400).json({status: "Error", message: "Game is full"});
    }
    if (playerNames.includes(username)) {
        return res.status(400).json({status: "Error", message: "Username is already taken"})
    }

    const token: any = game.addPlayer(username);
    res.status(200).json({status: 'Success', token});
}) 

module.exports = router;
