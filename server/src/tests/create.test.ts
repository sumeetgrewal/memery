const app = require('../index')
const supertest = require('supertest');
import { gameServer } from '../models/gameServer.model';


let gameId: string;
let server: any, agent: any;

beforeAll((done) => {
    process.env.NODE_ENV = 'test';
    server = app.listen(3001, (err: any) => {
        if (err) return done(err);
        agent = supertest.agent(server); 
        done();
    });
})

afterAll(async () => {
    await server.close() 
})

describe('GET /game/create', () => {

    it('Create new game, return 200', async () => {
        let response = await agent.get('/game/create')
            .set('Content-Type', 'application/json')
            .expect(200)

        gameId = response.body.gameId;
        console.log(gameId);
    })

    it('Create 11 games, return 400', async () => {
        let games: Promise<void>[] = [];
        for (let i = 0; i < 10; i++) {
            games.push(
                agent.get('/game/create')
                .set('Content-Type', 'application/json')
            )
        }  
        Promise.all(games)
        .then(() => {
            agent.get('/game/create')
            .set('Content-Type', 'application/json')
            .expect(400)
        })
    })
})

describe('POST /game/create', () => {
    it('Join Existing Game, return 200', async () => {
        await agent.post('/game/create')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({gameId}))
            .expect(200)

    })
    
    it('Join Non-Existent Game, return 401', async () => {
        await agent.post('/game/create')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({gameId: 'ABC'}))
            .expect(401)
    })
    
    it('Join Game in Progress, return 402', async () => {
        gameServer.games[gameId].status = "game";
        await agent.post('/game/create')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({gameId}))
            .expect(402)
    })

})
