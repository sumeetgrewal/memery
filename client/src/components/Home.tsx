import * as React from 'react';
import '../assets/css/home.css';
import GameIdForm from './GameIdForm';
import arrow from '../assets/images/arrow-light.png'


interface HomeProps { }

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
    }


    toggleJoin() {
        this.setState({enterCode: !this.state.enterCode})
    }

    createNewGame() {
        // TODO
    }

    render() {
        return <div id="home"> 
            <div id="home-container">
                <h1 id="home-title" className="text-reflect">MEMERY</h1>
                <h3 className="home-link home-join text-reflect">join</h3>
                <h3 className="home-link home-new text-reflect">neW GAMe</h3>
            </div> 
            <div id="home-background">
                {(this.state.enterCode) ? <GameIdForm />
                : <input type="image" src={arrow} className={`arrow-btn home-join`} alt="arrow button" autoFocus={true} onClick={this.toggleJoin}/>}
                <input type="image" src={arrow} className={`arrow-btn home-new`} alt="arrow button" onClick={this.createNewGame}/>
            </div>
        </div>
    }    
}
