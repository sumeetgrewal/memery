const app = require('../index')
const supertest = require('supertest');
const agent = supertest(app);
import {gameServer} from '../models/gameServer.model'

let gameCode: string;

describe('GET /game/join', () => {

    it('Create new game, return 200', async () => {
        let response = await agent.get('/game/join')
            .set('Content-Type', 'application/json')
            .expect(200)

        gameCode = response.body.gameCode;
        console.log(gameCode);
    })

    it('Create 11 games, return 400', async () => {
        let games: Promise<void>[] = [];
        for (let i = 0; i < 10; i++) {
            games.push(
                agent.get('/game/join')
                .set('Content-Type', 'application/json')
            )
        }  
        Promise.all(games)
        .then(() => {
            agent.get('/game/join')
            .set('Content-Type', 'application/json')
            .expect(400)
        })
    })
})

describe('POST /game/join', () => {
    it('Join Existing Game, return 200', async () => {
        await agent.post('/game/join')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({gameCode}))
            .expect(200)

    })
    
    it('Join Non-Existent Game, return 401', async () => {
        await agent.post('/game/join')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({gameCode: 'ABC'}))
            .expect(401)
    })
    
    it('Join Game in Progress, return 402', async () => {
        gameServer[gameCode].status = "game";
        await agent.post('/game/join')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({gameCode}))
            .expect(402)
    })

})
