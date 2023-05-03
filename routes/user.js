const express = require("express");
const userRoute = express.Router();
const User = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(50).required(),
});


// user Register route post request
userRoute.post("/register", async (req, res) => {
    const validationMsg = userSchema.validate(req.body);

    if (validationMsg.error) {
        res.send(validationMsg.error.details[0].message);
    } else {
        const alreadyUser = await User.findOne({ email: req.body.email });
        if (alreadyUser) {
            res.send("The user with this email has already registered");
            console.log(alreadyUser);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            // insert into DB!!!
            const userRegResponse = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                image: req.body.image
            });
            res.send(userRegResponse?.name + " has successfully register");
        }
    }
});

// User login route
userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        console.log(res);
    } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.send("Invalid Password...");
        } else {
            // create token if user is valid
            const token = jwt.sign(
                { _id: user._id, iat: Date.now() },
                process.env.SECRET
            );
            res.send({ token: token, user: user });
        }
    }
});

module.exports = userRoute;