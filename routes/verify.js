const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const token = req.cookies['angularblog'];
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user) {
            res.status(200).send({username: user});
        }
    } catch(error) {
        res.clearCookie('angularblog');
        return res.sendStatus(401);
    }
})

module.exports = router;