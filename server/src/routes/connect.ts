import { Game, pushUpdateToPlayers } from "../models/game.model";
import { gameServer } from "../models/gameServer.model";

let JWTHandlers = require('../middleware/jwt.authorization');
const router = require('express').Router({ mergeParams: true }); 
const PLEASE_STAY_ALIVE_TIMEOUT = 50000;

router.route('/').get((req: any, res: any) => {
  const { gameId } = req.params;
  const decodedToken: any = JWTHandlers.checkToken(req);
  if (!decodedToken) return res.status(400).json({ status: 'Error', message: 'Invalid token'});

  const { username } = decodedToken;
  const game = gameServer.games[gameId];
  addClientToGame(game, username, res);
  
  req.on('close', () => {
    console.log("Closed connection", username);
    res.end();
    game.removePlayer(username);
  })
  console.log(game.players);
})

function addClientToGame(game: Game, username: string, client: any) {
  game.addClient(username, client);
  sendWelcomeMessage(client);
  
  const CPR = () => {
    pushUpdateToPlayers(game.gameId, '', 'CPR', [username])
    setTimeout(CPR, PLEASE_STAY_ALIVE_TIMEOUT)
  }
  setTimeout(CPR, PLEASE_STAY_ALIVE_TIMEOUT)
}

function sendWelcomeMessage(client: any) {
  const headers: any = { 
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  client.writeHead(200, headers);
  client.write(`id: ${1}\n`);
  client.write(`event: joined\n`);
  client.flush();
}

// router.route('/').delete((req: any, res: any) => {
//   const decodedToken: any = JWTHandlers.checkToken(req);
//   if (!decodedToken) {
//     res.status(400).json({status: 'Error', message: 'Invalid token'});
//   } else if (!(decodedToken.username in game.players)) {
//     res.status(400).json({status: 'Error', message: 'Player not found'});
//   } else {
//     const username: string = decodedToken.username;
//     serverData.clients = serverData.clients.filter((client: any) => client.id !== username);
//     delete game.players[username];
//     resetToLobby();
//     pushUpdateToPlayers( JSON.stringify({players: game.players}), 'playerupdate', serverData.clients );
//     res.json({status: 'success'});
//   }
// });

// router.route('/').post((req: any, res: any) => {
//   const decodedToken: any = JWTHandlers.checkToken(req);
//   if (!decodedToken) { 
//     res.status(400).json({ status: 'Error', message: 'Invalid token'});
//   } else {
//     if (game.metadata.gameStatus === 'game') {
//       replayGame();
//       res.json({status: 'success'});
//     } else {
//       res.status(400).json({status: 'Error', message: "Game hasn't started"});
//     }
//   }
// })

module.exports = router;
