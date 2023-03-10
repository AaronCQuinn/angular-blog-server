const express = require('express');
const router = express.Router();
const User = require('../schema/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function checkPassword(str) {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}

async function encryptString(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

router.post('/', async (req, res, next) => {
    // Remove any spacing around registration values.
    const trimValues = {};
    Object.keys(req.body).forEach(key => {
        trimValues[key] = req.body[key].trim();
    });

    // Check to see all inputs have values.
    if (!Object.values(trimValues).every(Boolean)) {
        console.log("An input field didn't have any value.");
        return res.sendStatus(400);
    }

    const { username, email, password, confPassword } = trimValues;

    // Both passwords must pass validation checks.
    if (!checkPassword(password) || !checkPassword(confPassword)) {
        console.log('Password did not pass validation check.');
        return res.sendStatus(400);
    }

    // Both passwords must match.
    if (password !== confPassword) {
        console.log('Password confirmation did not match.');
        return res.sendStatus(400);
    }

    // Check if either the username or email already exists.
    const existingUser = await User.findOne({$or: [{ username: username }, { email: email }]}).catch(() => {
        console.log("Error checking Mongo for pre-existing user.");
        return res.sendStatus(500);
    })

    if (existingUser) {
        console.log('User already exists in DB.');
        return res.sendStatus(409);
    }
    
    try {
        const user = await User.create({
            username: username, 
            email: await encryptString(email), 
            password: await encryptString(password),
        })
        console.log('User successfully added to the database.');

        const { username: newUser } = user;

        const token = jwt.sign(newUser, process.env.JWT_SECRET);
        res.cookie("angularblog", token)
        return res.status(201).send({username: newUser});
    } catch(err) {
        console.log("Error writing user to the database: " + err);
        return res.sendStatus(500);
    }
})

module.exports = router;