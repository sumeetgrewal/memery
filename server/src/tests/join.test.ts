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
        await testEndpoint('post', `/game/ABC/join`, JSON.stringify(req),"", 404)
    })

    it('Player created successfully -> 200', async () => {
        let req: any = {
            username: 'Player One'
        }

        await testEndpoint('post', `/game/${gameId}/join`, JSON.stringify(req),"", 200)
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
        await testEndpoint('post', `/game/${gameId}/join`, JSON.stringify(req),"", 400)
    })

    it('Game is full -> 401', async () => {
        const players = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
        gameServer.games[gameId].status = 'setup';
        const promises = players.map((username: string) => {
            return agent.post(`/game/${gameId}/join`)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify({username}))
        });

        await Promise.all(promises).then(async () => { 
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
    const username = 'Player One';

    beforeAll(async () => {
        let response = await agent.get('/game/create')
            .set('Content-Type', 'application/json')

        gameId = response.body.gameId;
        gameServer.games[gameId].status = "setup";

        const res = await testEndpoint('post',`/game/${gameId}/join`, JSON.stringify({username}),"",200)
        token = res.body.token;
    })

    it("User doesn't have a token", async () => {
        await testEndpoint('put', `/game/${gameId}/join`, "",`token=${''}`, 400)
    })

    it("User selects I'm Ready", async () => {
        await testEndpoint('put', `/game/${gameId}/join`, "",`token=${token}`, 200)
    })

    it("User's status should be set to ready", () => {
        const { status } = gameServer.games[gameId].players[username];
        expect(status).toEqual("ready");
    })

    it("User selects I'm Ready", async () => {
        await testEndpoint('put', `/game/AAA/join`, "", `token=${token}`, 404)
    })
})

describe('DELETE /game/:gameId/join', () => {
    let gameId: string;
    let token: any;
    const username = 'Player One';

    beforeAll(async () => {
        let response = await agent.get('/game/create')
            .set('Content-Type', 'application/json')

        gameId = response.body.gameId;
        gameServer.games[gameId].status = "setup";

        const res = await testEndpoint('post',`/game/${gameId}/join`, JSON.stringify({username}),"",200)
        token = res.body.token;
    })

    it("Game does not exist", async () => {
        await testEndpoint('delete', `/game/AAA/join`, "",`token=${token}`, 404)
    })

    it("User doesn't have a token", async () => {
        await testEndpoint('delete', `/game/${gameId}/join`, "",`token=${''}`, 400)
    })

    it("User selects Exit", async () => {
        const players = gameServer.games[gameId].players
        expect(username in players).toBe(true);

        await testEndpoint('delete', `/game/${gameId}/join`, "",`token=${token}`, 200)
    })

    it("User has been removed from game", () => {
        const players = gameServer.games[gameId].players
        expect(username in players).toBe(false);
    })
})

describe('GET /game/:gameId/join/start', () => {
    let gameId: string;
    let token: any;
    const username = 'Player One';

    beforeAll(async () => {
        let response = await agent.get('/game/create')
            .set('Content-Type', 'application/json')

        gameId = response.body.gameId;
        gameServer.games[gameId].status = "setup";

        const res = await testEndpoint('post',`/game/${gameId}/join`, JSON.stringify({username}),"",200)
        token = res.body.token;
        await testEndpoint('post',`/game/${gameId}/join`, JSON.stringify({username: "Player Two"}),"",200)
    })

    it("Game does not exist", async () => {
        await testEndpoint('get', `/game/AAA/join/start`, "",`token=${token}`, 404)
    })

    it("User doesn't have a token", async () => {
        await testEndpoint('get', `/game/${gameId}/join/start`, "",`token=${''}`, 400)
    })

    it("User is not ready", async () => {
        await testEndpoint('get', `/game/${gameId}/join/start`, "",`token=${token}`, 403)
    })

    it("One user is ready, one is not", async () => {
        gameServer.games[gameId].players[username].status = 'ready';
        await testEndpoint('get', `/game/${gameId}/join/start`, "",`token=${token}`, 403)
    })

    it("All users ready, start game", async () => {
        const game = gameServer.games[gameId]
        
        game.players['Player Two'].status = 'ready';

        await testEndpoint('get', `/game/${gameId}/join/start`, "",`token=${token}`, 200)

        expect(game.status).toEqual("game")
    })
})

async function testEndpoint( method: string, endpoint: string, data: string = "", cookie: any = "", expectCode: number) {    
    return await agent[method](endpoint)
            .set('Content-Type', 'application/json')
            .set('Cookie', cookie)
            .send(data)
            .expect(expectCode);
}
