import { gameServer } from '../models/gameServer.model';

const router = require('express').Router({ mergeParams: true});

router.route('/').post((req: any, res: any) => {
    console.log(gameServer)
})

module.exports = router;
