"use strict";

var express = require('express');

var router = express.Router();

var academic_controller = require('../controllers/academic_controller');

router.get('/view/', academic_controller.view); //router.get('/dept/:fac',uni_details.get_dept);

module.exports = router;