const express = require('express');
const router = express.Router();
const api_controller = require('../controllers/api');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);
router.get('/pages/:org_key', api_controller.getPageDetailsByOrgKey);
router.post('/pages', api_controller.createPage);
router.patch('/pages', api_controller.updatePage);
router.get('/keys', api_controller.listOfOrgKey);


module.exports = router;