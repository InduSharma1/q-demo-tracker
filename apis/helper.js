const Mixpanel = require('./controllers/mixpanel');
/**
     * catch exceptions and send back the error message
     * @param res Response
     * @param message error message
     * @param status http status code
     * @param method_name name of the method which failed
     * @param expired if the connection expired
     * @returns http response
     */
function catchExceptions(res, message, status = 500, method_name = '', expired = false) {
    const props = { success: false, error: message };
    if (expired) props.expired = true;

    if (method_name) trackMixpanel(method_name, message);

    return res.status(status).json(props);
}

/**
 * track the error scenarios to mixpanel
 * @param method_name name of the method which failed
 * @param message error message
 */
function trackMixpanel(method_name, message) {
    Mixpanel.track({ action: 'Error', error: message, error_method: method_name });
}

module.exports = {
    catchExceptions
};