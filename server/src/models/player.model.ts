interface PlayerModel {
    id: number;
    username: string;
    client: any;
    status: string;
}

export class Player implements PlayerModel {
    id = 0;
    username = "";
    status = "joined";
    client = undefined;
    constructor(username: string, id: number) {
        this.username = username;
        this.id = id;
    }
}
