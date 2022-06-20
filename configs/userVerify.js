const jwt = require('jsonwebtoken');
module.exports = function(req, res, next){
    const token = req.header('token');
    if(!token) return res.status(401).json({error: 'Access Denied'});

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(error){
        res.status(403).json({message: "Invalid Token"});
    }
}