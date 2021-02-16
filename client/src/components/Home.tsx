import { useState } from 'react';
import '../assets/css/home.css';
import IdForm from './IdForm';
import arrow from '../assets/images/arrow-light.png'

interface HomeProps { 
    setGameId: (gameId: string) => Promise<void>
}

export default function Home (props: HomeProps) {
    const [ enterCode, setEnterCode] = useState(false);
    const [ errorMessage, setErrorMessage] = useState("");

    const toggleJoin = () =>  {
        setEnterCode(!enterCode)
    }

    const createNewGame = (): Promise<void> => {
        return new Promise((resolve) => {
            fetch('/game/create')
            .then(async (res: any) => {
                await res.json()
                .then((data: any) => {
                    if (res.status >= 400) throw new Error(`${res.status}: ${data.message}`)
                    console.log(data.gameId);
                    props.setGameId(data.gameId).then(resolve)
                })
            }).catch((error: Error) => {
                setErrorMessage(error.message);
                resolve();
            });
        })
    }

    const sendJoinRequest = (code: string): Promise<void> => {
        return new Promise((resolve) => {
            fetch('/game/create/', {
                method: "POST", 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'gameId': code.toUpperCase()})
            }).then(async (res: any) => {
                await res.json()
                .then((data: any) => {
                    if (res.status !== 200) throw new Error(`${res.status} ${data.message}`);
                    props.setGameId(data.gameId).then(resolve)
                })
            }).catch((error: Error) => {
                setErrorMessage(error.message)
                resolve()
            })
        })
    }  

    return (<div id="home"> 
        <div id="home-container">
            <h1 id="home-title" className="text-reflect">MEMERY</h1>
            <h3 className="home-link home-join text-reflect">join</h3>
            <h3 className="home-link home-new text-reflect">neW GAMe</h3>
        </div> 
        <div id="home-background" className="memery-tile">
            {(errorMessage !== "") && (
                <div className="home-error-message label error">{errorMessage}</div>
            )}
            {(enterCode) ? <IdForm numInputs={4} submitHandler={sendJoinRequest}/>
            : <input type="image" src={arrow} className={`arrow-btn home-join`} alt="arrow button" autoFocus={true} onClick={toggleJoin}/>}
            <input type="image" src={arrow} className={`arrow-btn home-new`} alt="arrow button" onClick={createNewGame}/>
        </div>
    </div>)
}
