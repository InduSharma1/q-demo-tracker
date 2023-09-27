const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth');
const { authenticateTokenForGetAuth } = require('../middleware/passportValidation');

router.post('/register', authenticateTokenForGetAuth, auth_controller.register);
router.get('/handoff/:handoff_param', auth_controller.handoff);
router.post("/canvas/", auth_controller.canvasAuthentication);
router.get('/checkauth', auth_controller.checkForSession);
router.get('/login', auth_controller.login);

module.exports = router;