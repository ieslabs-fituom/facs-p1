//Load dependencies
const express = require('express');

//dotenv load environment variables in .env file as process.env.<property_name>
require('dotenv').config();

//Create express app
const app = express();

//Runtime Port - load from .env file or use 5000
const port = process.env.PORT || 5000;

/*
*   Parsing middlewares
*   express.urlencoded : Recognizing incoming request object as strings/arrays
*   express.json : Recognizing incoming request object as json object
*   express.static('<static_file_location') : Load images/CSS/JS files most commonly which are stored in 'public' folder. Use <folder_name> instead of 'public' if needed
*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Load routes



// Start the application
app.listen(port, () => console.log('Listening on port ' + port));