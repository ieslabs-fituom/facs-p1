const mysql = require('mysql2');
const commonFunctions = require('./common_functions');
const nonacademic_controller = require('./nonacademic_controller');

// MYSQL CONNECTION (CHANGE .env FILE WHEN TESTING. DON'T EDIT THESE PARAMETERS)
let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_TOKEN,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

exports.sign_in_view = async (req, res) => {
    res.render('sign-in');
}

exports.continue_sign_in = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;


    let loadUserDetails = (email) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT id,Designation,Password FROM employees WHERE Email = "' + email + '"';
            conn.query(sql, (err, rows) => {
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(err);
                }
            })
        })
    }

    loadUserDetails(email)
        .then((rows) => {
            if (rows.length == 0) {
                res.send({ status: '201', message: 'User not found' });
            } else {
                if (rows[0].Password == password) {
                    process.env.CURRENT_ID = rows[0].id;
                    process.env.CURRENT_TYPE = rows[0].Designation;

                    res.send({ status: '200', type: rows[0].Designation });
                } else {
                    res.send({ status: '202', message: 'Incorrect password' });
                }
                
            }

        })
        .catch((err) => {
            console.log(err);
            res.send({ status: '500', message: 'Internal Server Error' })
        });
}