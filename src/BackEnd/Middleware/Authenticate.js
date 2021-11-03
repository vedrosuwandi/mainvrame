const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) =>{
    try{

        //Send the token with the bearer string in the header as auth key
        const token =  localStorage.getItem("token");
        
        req.headers.authorization.split(' ')[1] = token;
        //decode the secret in the token which is the identity of the token
        const decode = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET_KEY);
        
        req.user = decode

        next()

    }catch(err){
        if(err.name == "TokenExpiredError"){
            res.status(401).json({
                message : "Token Expired!"
            })
            return
        }
        res.json({
            message : "Authentication Failed!",
        })
    }
}

module.exports = authenticate