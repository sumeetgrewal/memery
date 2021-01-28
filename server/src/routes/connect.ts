let JWTHandlers = require('../middleware/jwt.authorization');
const router = require('express').Router(); 
const keepAliveMS = 50000;

router.route('/').get((req: any, res: any) => {
  const decodedToken: any = JWTHandlers.checkToken(req);
  if (!decodedToken) { 
    res.status(400).json({ status: 'Error', message: 'Invalid token'});
  } else {
    const username: string = decodedToken.username;
    const headers: any = { 
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    res.write(`id: ${1}\n`);
    res.write(`event: joined\n`);
    res.write(`data: ${JSON.stringify({ })}\n\n`);
    res.flush();

    // TODO Add Client

    req.on('close', () => {
      console.log("Closed connection", username);
      res.end();
      // TODO Remove Client
    })
  }
})


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
