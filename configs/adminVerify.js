const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
module.exports = async function(req, res, next){
    const token = req.header('token');
    if(!token) return res.status(401).json({error: 'Access Denied'});

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({_id: verified});
        if(!user) return res.status(404).json({error: 'Admin Not Exist'});
        if(user.isAdmin == true){
            req.user = verified;
            next();
        }else{
            res.status(401).json({error: 'Unauthorized Admin Access'});
        }
    }catch(error){
        res.status(403).json({error: 'Invalid Token'});
    }
}