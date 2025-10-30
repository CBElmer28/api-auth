const jwt = require("jsonwebtoken");

function signAccessToken(payload) {
    return jwt.sign (payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
});
}

function verifyToken (token) {
return jwt.verify (token, process.env.JWT_SECRET);
}

module.exports = { signAccessToken, verifyToken };