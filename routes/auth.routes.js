const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');


/**
* @swagger
*   /auth/create:
*   post:
*       description: Create new user account
*       summary: 
*       tags:
*           - Authentication
*       responses:
*           '200':
*               description: JWT Token & User Object
*               schema:
*                 type: object
*                 properties:
*                   token:
*                       type: string
*                   name:
*                       type: string
*                   message:
*                       type: string
*       parameters:
*         - in: body
*           name: auth info
*           schema:
*              type: object
*              properties:
*                  name:
*                      type: string
*                  email:
*                      type: string
*                  password:
*                      type: string
*/
router.post('/create', async (req, res) => {
    let userExist;
    try{
        userExist = await User.findOne({email: req.body.email});
    }catch(error){
        return res.status(500).json({error: '500 Internal Server Error'});
    }
    if(userExist) return res.status(400).json({error: 'The Email Already Exist'});
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


/**
* @swagger
*   /auth/login:
*   post:
*       description: Authorize Account
*       summary: 
*       tags:
*           - Authentication
*       responses:
*           '200':
*               description: JWT auth token
*               schema:
*                 type: object
*                 properties:
*                   token:
*                       type: string
*                   isAdmin:
*                       type: string
*                   name:
*                       type: string
*           '500':
*               description: Server Error
*               schema:
*                 type: object
*                 properties:
*                   error:
*                       type: string
*       parameters:
*         - in: body
*           name: auth info
*           schema:
*              type: object
*              properties:
*                  phone:
*                      type: string
*                      required: true
*                  password:
*                      type: string
*                      required: true
*/
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