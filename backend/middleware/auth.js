const jwt = require('jsonwebtoken');
require('dotenv').config();

//Middleware to verify JWT token
const auth = (req, res, next) => {
    //Getting token from header
    const token = req.header('Authorization');

    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Invalid token format' });
    }
    const actualToken = tokenParts[1];

    // console.log(tokenParts)

    //Verify token
    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is invalid' })
    }
};

module.exports = auth;