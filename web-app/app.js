// LOAD DEPENDENCIES
const express = require('express');
const jwt = require('jsonwebtoken');
const pug = require('pug');

// DOTENV LOAD ENVIRONMENT VARIABLES IN .ENV FILE AS PROCESS.ENV.<PROPERTY_NAME>
require('dotenv').config();

// CREATE EXPRESS APP
const app = express();

// RUNTIME PORT - LOAD FROM .ENV FILE OR USE 5000
const port = process.env.PORT || 5000;

/*
*   PARSING MIDDLEWARES
*   EXPRESS.URLENCODED : RECOGNIZING INCOMING REQUEST OBJECT AS STRINGS/ARRAYS
*   EXPRESS.JSON : RECOGNIZING INCOMING REQUEST OBJECT AS JSON OBJECT
*   EXPRESS.STATIC('<STATIC_FILE_LOCATION') : LOAD IMAGES/CSS/JS FILES MOST COMMONLY WHICH ARE STORED IN 'PUBLIC' FOLDER. USE <FOLDER_NAME> INSTEAD OF 'PUBLIC' IF NEEDED
*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static',express.static('public'));

// SETTING UP TEMPLATE ENGINE - PUG
app.set('views', './views');
app.set('view engine', 'pug');

// LOAD ROUTES

const uni_details_routes = require('./server/routes/uni_details');
app.use('/uni/', uni_details_routes);
app.get('/', (req, res) => {
  res.render('sample_view', { title: 'Hey', message: 'Hello there!' });
});

// START THE APPLICATION
app.listen(port, () => console.log('Listening on port ' + port));