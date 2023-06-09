"use strict";

var express = require('express');

var router = express.Router();

var nonacademic_controller = require('../controllers/nonacademic_controller');

router.get('/stu/', nonacademic_controller.stu_view);
router.get('/stu/getfiltered', nonacademic_controller.stu_get_filtered);
router.get('/stuprofile', nonacademic_controller.stu_get_profile);
router.get('/past', nonacademic_controller.past_reports_view);
router.get('/past/getgroups', nonacademic_controller.past_get_groups);
router.get('/past/getsessions', nonacademic_controller.past_get_sessions);
router.get('/past/getsessionattendance', nonacademic_controller.past_get_sessionattendance);
router.get('/moduleattendance', nonacademic_controller.past_moduleattendance_view);
router.get('/moduleattendance/get', nonacademic_controller.past_moduleattendance);
router.get('/degreeattendance', nonacademic_controller.past_degreeattendance_view);
router.get('/degreeattendance/get', nonacademic_controller.past_degreeattendance);
router.get('/timetable', nonacademic_controller.timetable_view);
router.get('/timetable/getlectures', nonacademic_controller.timetable_getlectures);
router.get('/today/', nonacademic_controller.today_view);
router.get('/today/getSessions/', nonacademic_controller.today_getsessions);
router.get('/today/loadEmployeesOfGroup/', nonacademic_controller.today_loadEmployeesOfGroup);
router.post('/today/addSessionUsingTimeTableID/', nonacademic_controller.today_addSession);
router.get('/semester/', nonacademic_controller.sem_view);
router.get('/addgroup/', nonacademic_controller.add_group_view);
router.get('/addgroup/verifygroup', nonacademic_controller.add_group_verifygroup);
router.get('/addgroup/getstudent', nonacademic_controller.add_group_getstudent);
router.get('/addgroup/getemployee', nonacademic_controller.add_group_getemployee);
module.exports = router;