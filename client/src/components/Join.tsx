import { useState } from 'react';

export default function Join() {
    const [username, setUsername] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        sendJoinRequest(username);
    }

    const sendJoinRequest = (username: string) => {
        console.log(username);
    }

    const handleInputChange = (e: any) => {
        const { value } = e.target;
        setUsername(value.trim())
    }


    return (
        <div className="dialog-bg memery-tile h-100"> 
            <div className="dialog">
                <h1 className="page-title text-center">JOIN game</h1>
                <form className="user-form">
                    <h3 className="label">username</h3>
                    <input type="text" id="username" maxLength={20} autoComplete={"off"} autoFocus={true} onChange={handleInputChange} value={username} spellCheck={false} />
                </form>
                <div className="text-center">
                    <button onClick={handleSubmit}>JOIN</button>
                </div>
            </div>
        </div>
    )
}
