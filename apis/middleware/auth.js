const { catchExceptions } = require("../helper");
const forge = require("node-forge");
const privateKeyPem = process.env.VITE_APP_DECRYPTION_KEY;
async function isAuthenticated(req, res, next) {
    if (!req.session.accessToken) {
        return catchExceptions(res, 'Unauthorized', 401);
    }
    if (req.method === "POST") {
        // Get the encrypted data and key from the request body
        const { data, key } = req.body;

        // Decrypt the AES key with the RSA private key
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const decryptedKey = privateKey.decrypt(
            forge.util.decode64(key),
            "RSA-OAEP"
        );

        // Decrypt the data with the decrypted AES key
        const decipher = forge.cipher.createDecipher("AES-CBC", decryptedKey);
        decipher.start({ iv: decryptedKey }); // We used the AES key as the IV in the interceptor
        decipher.update(forge.util.createBuffer(forge.util.decode64(data)));
        decipher.finish();
        console.log('req.body ', decipher.output);

        // Replace the request body with the decrypted data
        req.body = JSON.parse(decipher.output.toString("utf8"));
        console.log('req.body ', req.body);
    }
    next();
};

async function mixpanelTrack(req, res, next) {
    if (!req.session.accessToken) {
        return catchExceptions(res, 'Unauthorized', 401);
    }
    next();
};

module.exports = { isAuthenticated, mixpanelTrack };