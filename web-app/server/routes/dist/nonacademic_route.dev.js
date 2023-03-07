"use strict";

var express = require('express');

var router = express.Router();

var nonacademic_controller = require('../controllers/nonacademic_controller');

router.get('/view/', nonacademic_controller.view);
router.get('/sem/', nonacademic_controller.sem_view);
router.get('/stu/', nonacademic_controller.stu_view);
router.get('/stu/getfiltered', nonacademic_controller.stu_get_filtered);
router.get('/stuprofile', nonacademic_controller.stu_get_profile);
module.exports = router;