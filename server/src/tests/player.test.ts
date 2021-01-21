const app = require('../index')
const supertest = require('supertest');
import {gameServer} from '../models/gameServer.model'

let gameCode: string;
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

describe('POST /player', () => {

    beforeAll(async () => {
        let response = await agent.get('/game/join')
            .set('Content-Type', 'application/json')

        gameCode = response.body.gameCode;
        console.log(gameCode);
        gameServer[gameCode].status = "setup";
    })

    it('Game does not exist -> 300', async () => {
        let req: any = {
            gameCode: 'ABC',
            username: 'Player One'
        }
    
        await agent.post('/player')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(req))
            .expect(300)
    })

    it('Player created successfully -> 200', async () => {
        let req: any = {
            gameCode,
            username: 'Player One'
        }

        await agent.post('/player')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(req))
        .expect(200);
    })

    it('Username is already taken -> 400', async () => {
        let req: any = {
            gameCode,
            username: 'Player One'
        }

        await agent.post('/player')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(req))
        .expect(400)
        .expect((res: any) => {
            res.body.message = "Username is already taken"
        })
    })

    it('Game is in progress -> 400', async () => {
        let req: any = {
            gameCode,
            username: 'Player One'
        }

        gameServer[gameCode].status = 'game';

        await agent.post('/player')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(req))
        .expect(400)
        .expect((res: any) => {
            res.body.message = "Username is already taken"
        })
    })

})
