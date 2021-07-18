const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

router.post('/create', async (req, res) => {
    let userExist;
    try{
        userExist = await User.findOne({email: req.body.email});
    }catch(error){
        return res.status(500).json({message: '500 Internal Server Error', error: error});
    }
    if(userExist) return res.status(400).json({message: 'The Email Already Exist'});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE A USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        res.status(200).json({token: token, name: req.body.name});
    }catch(error){
        console.log(error)
        return res.status(500).json({message: '500 Internal Server Error', error: error});
    }
});


router.post('/login', async (req, res) => {
    let user;
    try{
        user = await User.findOne({email: req.body.email});
    }catch(error){
        return res.status(500).json({message: '500 Internal Server Error', error: error});
    }

    if(!user) return res.status(400).json({message: 'User not found'});

    const verifyPassword = await bcrypt.compare(req.body.password, user.password);
    if(!verifyPassword) return res.status(400).json({message: "Error Password"});

    token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.status(200).header('token', token).json({token: token, name: user.name, email: user.email});
});

module.exports = router;