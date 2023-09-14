const express = require('express');
const router = express.Router();
const mixpanel_controller = require('../controllers/mixpanel');
const { mixpanelTrack } = require('../middleware/auth');

router.post('/track', mixpanelTrack, mixpanel_controller.track);

module.exports = router;
