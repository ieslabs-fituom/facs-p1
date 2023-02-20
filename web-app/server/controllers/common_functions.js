const mysql = require('mysql2');

/* 
*   THIS CONTROLLER IS USED TO DEFINE COMMONLY USED FUNCTIONS
*   EX : LOADING ALL DESTINATIONS, LOADING ALL FACULTIES, LOADING ALL DEPARTMENTS OF A PARTICULAR FACULTY
*   ALWAYS SEND CONNECTION AS A PARAMETER TO THE COMMON FUNCTION FROM THE CONTROLLER
*   CREATE FUNCTIONS AS MINIMIZING THE CODE (USE COLUMN LISTS TO RETRIEVE ONLY REQUIRED COLUMNS)
*/

exports.getDesignations = (conn) => {
    return new Promise((resolve,reject) => {
        conn.query('SELECT * FROM designations', (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}