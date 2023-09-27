const { catchExceptions } = require("../helper");
const forge = require("node-forge");
const privateKeyPem = process.env.VITE_APP_DECRYPTION_KEY || "";

async function isAuthenticated(req, res, next) {
    if (!req.session.email) {
        return catchExceptions(res, 'Unauthorized', 401);
    }
    if (req.method === "POST" || req.method === 'PATCH') {
        // Get the encrypted data and key from the request body
        const { data, key } = req.body;

        // Decrypt the AES key with the RSA private key
        const private_key = forge.pki.privateKeyFromPem(privateKeyPem);
        const decrypted_key = private_key.decrypt(
            forge.util.decode64(key),
            "RSA-OAEP"
        );

        // Decrypt the data with the decrypted AES key
        const decipher = forge.cipher.createDecipher("AES-CBC", decrypted_key);
        decipher.start({ iv: decrypted_key }); // We used the AES key as the IV in the interceptor
        decipher.update(forge.util.createBuffer(forge.util.decode64(data)));
        decipher.finish();

        // Replace the request body with the decrypted data
        req.body = JSON.parse(decipher.output.toString("utf8"));
    }
    next();
};

async function mixpanelTrack(req, res, next) {
    if (!req.session.email) {
        return catchExceptions(res, 'Unauthorized', 401);
    }
    next();
};

module.exports = { isAuthenticated, mixpanelTrack };
