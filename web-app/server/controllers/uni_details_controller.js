const mysql = require('mysql2');

let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_TOKEN,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

exports.get_fac = (req, res) => {
    console.log('Function Accessed...\n');
    conn.query('SELECT * FROM faculties', (err, rows) => {
        if (!err) {
            console.log(rows);
        } else {
            console.log("ERROR : " + err);
        }
    });
}


exports.get_dept = (req, res) => {
    console.log('Function accessed...');
    conn.query('SELECT * FROM departments WHERE Faculty = ' + req.params.fac, (err, rows) => {
        (!err) ? console.log(rows) : console.log(err);
    });
}