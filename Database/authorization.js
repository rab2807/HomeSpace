const jwt = require('jsonwebtoken');

const MAX_VALIDITY = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({id}, process.env.DB_PRIVKEY, {
        expiresIn: MAX_VALIDITY
    });
};

const extractToken = (req) => {
    const token = req.cookies.jwt;
    let ans = null;
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.DB_PRIVKEY, (err, decodedToken) => {
            if (err)
                throw err;
            else
                ans = decodedToken;
        });
    }
    return ans;
}

const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.DB_PRIVKEY, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    createToken, extractToken, authMiddleware
}
