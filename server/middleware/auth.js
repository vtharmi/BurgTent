const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded  = jwt.verify(token , 'thisissecrete');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}); 

        if(!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        req.userData = {email: decoded.email, _id: decoded._id  }
        next();
    } catch (e) {
        res.status(401).send({error: "User is not authenticated"});
    }
}

module.exports = auth;