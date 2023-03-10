const express = require('express');
const router = express.Router();
const User = require('../schema/UserSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async(req, res) => {
    const trimValues = {};
    Object.keys(req.body).forEach(key => {
        trimValues[key] = req.body[key].trim();
    });

    if (!Object.values(trimValues).every(Boolean)) {
        console.log("An input field didn't have any value.");
        return res.sendStatus(400);
    }

    const {username, password} = trimValues;

    if (username && password) {
        const existingUser = 
        await User.findOne({$or: [{ username: username }, { email: username }]})
        .catch(() => {
            console.log("Error checking Mongo for pre-existing user.");
            return res.sendStatus(500);
        })

        if (!existingUser) {
            console.log('User not found in the database.')
            return res.sendStatus(404);
        }

        const comparePass = await bcrypt.compare(password, existingUser.password);

        if (!comparePass) {
            console.log('User entered the wrong password.');
            return res.sendStatus(401);
        }

        console.log("User provided correct credentials.");

        const token = jwt.sign(existingUser.username, process.env.JWT_SECRET);
        res.cookie("angularblog", token)

        return res.status(200).send({username: existingUser.username});
    }
})

module.exports = router;