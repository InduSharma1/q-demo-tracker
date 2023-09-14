const express = require('express');
const router = express.Router();
const api_controller = require('../controllers/api');
const { isAuthenticated } = require('../middleware/auth');

router.get('/pageDetails/:org_key', isAuthenticated, api_controller.getPageDetailsByOrgKey);
router.post('/createPageDetails', isAuthenticated, api_controller.createPage);
router.post('/updatePageDetails', isAuthenticated, api_controller.updatePage);
router.get('/keys', isAuthenticated, api_controller.listOfOrgKey);


module.exports = router;