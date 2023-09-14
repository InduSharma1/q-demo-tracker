const JWT = require('jsonwebtoken');
const { catchExceptions } = require("../helper");

async function authenticateTokenForGetAuth(req, res, next) {
    console.log("headers", req.headers);
    console.log("In Authenticate", req.headers.Authorization);
    const token = req.headers.authorization ? req.headers.authorization : null;
    if (!token) {
        return catchExceptions(res, 'Token not sent', 401);
    }

    const userInfo = await validateAuthToken(token);
    const valid = userInfo.valid;

    if (!valid) {
        return catchExceptions(res, 'Invalid Token', 401);
    }

    next();
}


async function validateAuthToken(token, secret = process.env.TOKEN_GENERATION_SECRET) {
    try {
        const data = await JWT.verify(token, secret);

        if (data && data.from === process.env.FROM_APP_SIGNATURE) {
            return { valid: true };
        } else {
            return { valid: false };
        }
    } catch (e) {
        console.log("error in JWT", e);
        return { valid: false }
    }
}
module.exports = {
    authenticateTokenForGetAuth
};