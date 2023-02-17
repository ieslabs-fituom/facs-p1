// LOAD DEPENDENCIES
const express = require('express');

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
app.use(express.static('public'));



// LOAD ROUTES



// START THE APPLICATION
app.listen(port, () => console.log('Listening on port ' + port));