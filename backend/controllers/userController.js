const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@desc Register user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password, _id} = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    const userEmail = await User.findOne({email});
    if (userEmail) {
        res.status(400);
        throw new Error('User already registered');
    }

    const userId = await User.findOne({_id});
    if (userId) {
        res.status(400);
        throw new Error('Id already existed');
    }

    const hashedPassord = await bcrypt.hash(password, 10);
    console.log(hashedPassord);

    const user = await User.create({
        username,
        email,
        password: hashedPassord,
        _id
    });

    console.log(user);
    if (user) {
        res.status(201).json({_id: user._id, email: user.email});
    } else {
        res.status(400);
        throw new Error('User data is not valid');
    }

    res.json({message: 'Register the user'})
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    const user = await User.findOne({email});
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1m"}
        )
        res.status(200).json({accessToken})
    } else {
        res.status(401);
        throw new Error('Email or password is not valid');
    }
});

//@desc Current user information
//@route GET /api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
    res.json({message: 'Current user information'})
});

module.exports = {registerUser, loginUser, currentUser};