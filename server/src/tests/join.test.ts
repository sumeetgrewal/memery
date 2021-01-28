const app = require('../index')
const supertest = require('supertest');
import { gameServer } from '../models/gameServer.model';

let server: any, agent: any;

beforeAll((done) => {
    process.env.NODE_ENV = 'test';
    server = app.listen(3002, (err: any) => {
        if (err) return done(err);
        agent = supertest.agent(server); 
        done();
    });
})

afterAll(async () => {
    await server.close() 
})

describe('POST /game/:gameId/join', () => {
    let gameId: string;

    beforeAll(async () => {
        let response = await agent.get('/game/create')
            .set('Content-Type', 'application/json')

        gameId = response.body.gameId;
        console.log(gameId, gameServer);
        gameServer.games[gameId].status = "setup";
    })

    it('Game does not exist -> 404', async () => {
        let req: any = {
            username: 'Player One'
        }
    
        await agent.post(`/game/ABC/join`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(req))
            .expect(404)
    })

    it('Player created successfully -> 200', async () => {
        let req: any = {
            username: 'Player One'
        }

        await agent.post(`/game/${gameId}/join`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(req))
        .expect(200);
    })

    it('Username is already taken -> 400', async () => {
        let req: any = {
            username: 'Player One'
        }

        await agent.post(`/game/${gameId}/join`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(req))
        .expect(400)
        .expect((res: any) => {
            res.body.message = "Username is already taken"
        })
    })

    it('Game is in progress -> 400', async () => {
        let req: any = {
            username: 'Player One'
        }

        gameServer.games[gameId].status = 'game';

        await agent.post(`/game/${gameId}/join`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(req))
        .expect(400)
    })

    it('Game is full -> 401', async () => {
        const players = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
        gameServer.games[gameId].status = 'setup';
        const promises = players.map((username: string) => {
            return agent.post(`/game/${gameId}/join`)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify({username}))
        });

        await Promise.all(promises).then(() => { 
            agent.post(`/game/${gameId}/join`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({username: 'Player Nine'}))
            .expect(401);
        })
    })
})

describe('PUT /game/:gameId/join', () => {
    let gameId: string;
    let token: any;

    beforeAll(async () => {
        let response = await agent.get('/game/create')
            .set('Content-Type', 'application/json')

        gameId = response.body.gameId;
        gameServer.games[gameId].status = "setup";

        const res = await agent.post(`/game/${gameId}/join`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({username: 'Player One'}))
        token = res.body.token;
    })

    it("User doesn't have a token", async () => {
        await agent.put(`/game/${gameId}/join`)
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${''}`)
            .expect(400);
    })

    it("User selects I'm Ready", async () => {
        await agent.put(`/game/${gameId}/join`)
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${token}`)
            .expect(200);
    })
})
