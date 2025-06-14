const jwt = require("jsonwebtoken");

const ACCESS_SECRET = "access-secret-key"; // 배포 시에는 env에서 선언
const REFRESH_SECRET = "refresh-secret-key"; // 배포 시에는 env에서 선언

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