import * as React from 'react';
import '../assets/css/home.css';
import IdForm from './IdForm';
import arrow from '../assets/images/arrow-light.png'

interface HomeProps { 
    setGameId: (gameId: string) => Promise<void>
}

interface HomeState {
    gameId: string,
    isNewGame: boolean,
    enterCode: boolean,
}

export default class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            gameId: "", 
            isNewGame: false,
            enterCode: false,
        }

        this.toggleJoin = this.toggleJoin.bind(this)
        this.sendJoinRequest = this.sendJoinRequest.bind(this)
        this.createNewGame = this.createNewGame.bind(this);
    }


    toggleJoin() {
        this.setState({enterCode: !this.state.enterCode})
    }

    createNewGame(): Promise<void>{
        return new Promise((resolve) => {
            fetch('/game/create')
            .then((res: any) => {
                if (res.status >= 400) { 
                    throw new Error(res.status + " " + res.statusText)
                } 
                res.json()
                .then((data: any) => {
                    console.log(data.gameId)
                    this.props.setGameId(data.gameId).then(resolve)
                })
            }).catch((error: Error) => {
                console.log(error.message);
                resolve();
            });
        })
    }

    sendJoinRequest(code: string): Promise<void> {
        return new Promise((resolve) => {
            // const state = Promise.resolve(this.setState({gameId: code}));
            fetch('/game/create/', {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'gameId': code})
            }).then((res: any) => {
                res.json()
                .then((data: any) => {
                    if (res.status !== 200) throw new Error(data.message);

                    console.log('Joined game');
                    this.props.setGameId(data.gameId).then(resolve)
                })
            }).catch((error: Error) => {
                console.log(error.message);
                resolve()
            })
        })

    }  

    render() {
        return <div id="home"> 
            <div id="home-container">
                <h1 id="home-title" className="text-reflect">MEMERY</h1>
                <h3 className="home-link home-join text-reflect">join</h3>
                <h3 className="home-link home-new text-reflect">neW GAMe</h3>
            </div> 
            <div id="home-background">
                {(this.state.enterCode) ? <IdForm numInputs={4} submitHandler={this.sendJoinRequest}/>
                : <input type="image" src={arrow} className={`arrow-btn home-join`} alt="arrow button" autoFocus={true} onClick={this.toggleJoin}/>}
                <input type="image" src={arrow} className={`arrow-btn home-new`} alt="arrow button" onClick={this.createNewGame}/>
            </div>
        </div>
    }    
}
