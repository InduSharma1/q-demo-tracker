import AxiosInstance from "./axios";
import forge from 'node-forge';

const publicKeyPem = import.meta.env.VITE_APP_ENCRYPTION_KEY;

AxiosInstance.interceptors.request.use(
    (config) => {
        if (config.method === 'post' && !config.url.includes('/mixpanel/track')) {
            try {
                // Generate a random AES key
                const aesKey = forge.random.getBytesSync(16);

                // Create a new AES-CBC cipher using our AES key
                const cipher = forge.cipher.createCipher('AES-CBC', aesKey);

                // Convert the request data into a byte buffer
                const buffer = forge.util.createBuffer(JSON.stringify(config.data), 'utf8');

                // Encrypt the buffer using the cipher
                cipher.start({ iv: aesKey });
                cipher.update(buffer);
                cipher.finish();
                const encrypted = cipher.output;

                // Fetch the RSA public key from your environment (assuming you have it)
                const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

                // Encrypt the AES key with the RSA public key
                const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP');

                // Update the request data with the encrypted data and key
                config.data = {
                    data: forge.util.encode64(encrypted.getBytes()),
                    key: forge.util.encode64(encryptedKey),
                };
            } catch (e) {
                console.error(e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default AxiosInstance;