const jwt = require("jsonwebtoken");

const ACCESS_SECRET = "access-secret-key";
const REFRESH_SECRET = "refresh-secret-key";

/* Access Token */
function generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

/* Refresh Token */
function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    ACCESS_SECRET,
    REFRESH_SECRET,
};