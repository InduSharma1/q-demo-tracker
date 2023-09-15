const Mixpanel = require("mixpanel");
const token = process.env.MIXPANEL_TOKEN || "";
const mixpanel = Mixpanel.init(token);
const eventName = process.env.VITE_APP_NAME || "";

/** send the track request to mixpanel */
async function track(user_email, mixpanel_data) {
    const distinct_id = user_email;

    const { action, data } = mixpanel_data;
    try {
        await mixpanel.track(eventName, {
            distinct_id,
            action,
            ...data,
        });
        console.log('mixpanel distinct_id ', distinct_id);
        console.log('mixpanel action ', action);
    } catch (err) {
        console.log('Mixpanel track error ', err.message);
    }

}

module.exports = {
    track
};
