"use strict";

var express = require('express');

var router = express.Router();

var common_controller = require('../controllers/common_controller.js'); // Routes for sign in


router.get('/', common_controller.sign_in_view);
router.post('/postattendance', common_controller.postattendance);
router.get('/signin', common_controller.sign_in_view);
router.post('/signin/contdsign', common_controller.continue_sign_in);
router.get('/signout', common_controller.continue_sign_out);
module.exports = router;