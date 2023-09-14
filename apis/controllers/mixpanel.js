const Mixpanel = require("mixpanel");
const token = process.env.MIXPANEL_TOKEN || "";
const mixpanel = Mixpanel.init(token);
const eventName = process.env.VITE_APP_NAME || "";

async function track(req, res) {
    console.log('Mixpanel track ', req.session.userInfo, ' ', req.session.email);
    const distinct_id = req.session.email;
    const { action, data } = req.body;
    try {
        await mixpanel.track(eventName, {
            distinct_id,
            action,
            ...data,
        });
        res.status(200).send({ success: true });
    } catch (err) {
        res.status(500).send({ success: false });
        console.log('Mixpanel track error ', err.message);
    }
};

module.exports = {
    track
};
