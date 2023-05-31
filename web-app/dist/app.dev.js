"use strict";

// LOAD DEPENDENCIES
var express = require('express');

var jwt = require('jsonwebtoken');

var pug = require('pug');

var mysql = require('mysql2');

var crypto = require('crypto'); // DOTENV LOAD ENVIRONMENT VARIABLES IN .ENV FILE AS PROCESS.ENV.<PROPERTY_NAME>


require('dotenv').config(); // CREATE EXPRESS APP


var app = express(); // RUNTIME PORT - LOAD FROM .ENV FILE OR USE 5000

var port = process.env.PORT || 5000;
/*
*   PARSING MIDDLEWARES
*   EXPRESS.URLENCODED : RECOGNIZING INCOMING REQUEST OBJECT AS STRINGS/ARRAYS
*   EXPRESS.JSON : RECOGNIZING INCOMING REQUEST OBJECT AS JSON OBJECT
*   EXPRESS.STATIC('<STATIC_FILE_LOCATION') : LOAD IMAGES/CSS/JS FILES MOST COMMONLY WHICH ARE STORED IN 'PUBLIC' FOLDER. USE <FOLDER_NAME> INSTEAD OF 'PUBLIC' IF NEEDED
*/

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use('/static', express["static"]('public')); // SETTING UP TEMPLATE ENGINE - PUG

app.set('views', './views');
app.set('view engine', 'pug'); // LOAD ROUTES

var academic_route = require('./server/routes/academic_route');

var nonacademic_route = require('./server/routes/nonacademic_route');

var common_route = require('./server/routes/common_route');

app.use('/ac/', academic_route);
app.use('/nac/', nonacademic_route);
app.use('/', common_route); // UNCOMENT FOLLOWING BLOCK TO CHANGE LOADING SCREEN TO REQUIRED VIEW : CHANGE 'sample_view' TO REQUIRED VIEW

/*app.get('/', (req, res) => {
  res.render('sample_view_2', { title: 'Hey', message: [1,2,3,4,5,6,7,8,9] });
});*/
// START THE APPLICATION

app.listen(port, function () {
  return console.log('Listening on port ' + port);
});