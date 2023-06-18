const express = require('express');
const router = express.Router();
const common_controller = require('../controllers/common_controller.js');

// Routes for sign in
router.get('/',common_controller.sign_in_view);
router.get('/signin',common_controller.sign_in_view);
router.post('/signin/contdsign',common_controller.continue_sign_in);

module.exports = router;