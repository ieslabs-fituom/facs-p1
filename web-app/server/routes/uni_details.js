const express = require('express');
const router = express.Router();
const uni_details = require('../controllers/uni_details_controller');

router.get('/fac',uni_details.get_fac);
router.get('/dept/:fac',uni_details.get_dept);


module.exports = router;


