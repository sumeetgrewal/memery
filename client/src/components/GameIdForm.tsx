import {  useState } from 'react'
import arrow from '../assets/images/arrow-light.png'

export default function GameIdForm () {
    const [ gameId, setGameId ] = useState(new Array(4).fill(""))


    const handleSubmit = () => {
        const code = gameId.join("")
        sendJoinRequest(code);
    }
    
    const sendJoinRequest = (code: string) => {
        console.log(code);
    }

    const handleInputChange = (e: any ) => {
        const { id, value } = e?.target;
        const newId = [...gameId];

        newId[Number(id)] = value;
        setGameId(newId);

        let element = document.getElementById(id)
        let next = element?.nextElementSibling;

        if (value.length === 1 && next) {
            (next as HTMLElement).focus()
        } 
    }

    const handleBack = (e: any) => {
        let element = document.getElementById(e.target.id)
        let prev = element?.previousElementSibling;

        if (e.keyCode === 8 && prev && e.target.value.length === 0) {
            (prev as HTMLElement).focus()
        }
    }

    return (<>
        <form name="gameIdForm" onSubmit={handleSubmit} className="gameIdForm">
            <input className="id-form-input" type="text" maxLength={1} value={gameId[0]} id="0" onKeyDown={handleBack} autoFocus={true} onChange={handleInputChange}/>
            <input className="id-form-input" type="text" maxLength={1} value={gameId[1]} id="1" onKeyDown={handleBack} onChange={handleInputChange}/>
            <input className="id-form-input" type="text" maxLength={1} value={gameId[2]} id="2" onKeyDown={handleBack} onChange={handleInputChange}/>
            <input className="id-form-input" type="text" maxLength={1} value={gameId[3]} id="3" onKeyDown={handleBack} onChange={handleInputChange}/>
            <input type="image" src={arrow} className={`arrow-btn submit-btn`} alt="arrow button" onClick={handleSubmit} />
        </form>
     </>)
}
