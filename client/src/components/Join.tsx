import { useState } from 'react';
import { avatarImages } from './GameAssets';
import '../assets/css/join.css'

export default function Join() {
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");

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

    const handleAvatarChange = (e: any): void => {
        e.preventDefault();
        const { id } = e.target;

        if (avatar !== id) {
            setAvatar(id);
        }
    }

    const handleArrows = (e: any): void => {
        let element = document.getElementById(e.target.id)
        let next = element?.nextElementSibling;
        let prev = element?.previousElementSibling;

        if (e.key === 'ArrowRight' && next) {
            (next as HTMLElement).focus()
        } else if (e.key==="ArrowLeft" && prev) {
            (prev as HTMLElement).focus()
        }
    }

    const renderAvatarOptions = () => {
        const avatars = Object.keys(avatarImages).map((val: string) => {
            const classes = `radio-img ${avatar===val ? 'img-checked' : ''}`;
            return (
                <input type="image" src={avatarImages[val]} 
                    onClick={handleAvatarChange} onKeyDown={handleArrows} 
                    alt={`radio-${val}`} key={`radio-${val}`} 
                    id={val} className={classes}
                />
            )
        })
        return (<div className="avatar-grid"> {avatars} </div>)
    }

    return (
        <div className="dialog-bg memery-tile h-100"> 
            <div className="dialog">
                <h1 className="page-title text-center">JOIN game</h1>
                <form className="user-form">
                    <h3 className="label">username</h3>
                    <input type="text" id="username" maxLength={20} autoComplete={"off"} autoFocus={true} onChange={handleInputChange} value={username} spellCheck={false} />
                    <h3 className="label">avatar</h3>
                    <div>
                        {renderAvatarOptions()}
                    </div>
                </form>
                <div className="text-center">
                    <button onClick={handleSubmit}>JOIN</button>
                </div>
            </div>
        </div>
    )
}
