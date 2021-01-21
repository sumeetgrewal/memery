const router = require('express').router();
let JWTHandlers = require('../middleware/jwt.authorization')


router.route('/').post((req: any, res: any) => {
    // const username = req.body.username;
    
}) 

module.exports = router;
