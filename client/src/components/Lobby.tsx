import { useState } from 'react';
import { Player } from '../../../server/src/models/player.model';
import { avatarImages } from './GameAssets';

interface LobbyProps {
    gameId: string,
    players: {
        [username: string] : Player
    },
}

export default function Lobby(props: LobbyProps) {
    
    return (
        <div className="dialog-bg memery-tile h-100"> 
            <div className="dialog">
                <div className="text-center">
                </div>
            </div>
        </div>
    )
}
