import * as React from 'react';
import '../assets/css/home.css';

interface HomeProps {
    
}

interface HomeState {
    gameId: string,
    isNewGame: boolean,
}

export default class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            gameId: "",
            isNewGame: false,
        }
    }



    render() {
        return <div id="home"> 
            <div id="home-container">
                <h1 id="home-title" className="text-reflect">MEMERY</h1>
                <h3 className="home-link home-join text-reflect">join</h3>
                <h3 className="home-link home-new text-reflect">neW GAMe</h3>
            </div> 
            <div id="home-background">

            </div>
        </div>
    }    
}
