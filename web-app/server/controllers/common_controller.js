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

exports.continue_sign_out = async (req, res) => {
    process.env.CURRENT_ID = "";
    process.env.CURRENT_TYPE = "";
    res.render('sign-in');
}

// This is the API used to gather attendance data from the device
exports.postattendance = async (req, res) => {
    let api_key = 'tPmAT5Ab3j7F9';
    console.log("Started");
    if (req.body.api_key != api_key) {
        console.log("Wrong API key");
        res.send(212);
        return;
    }

    let session_id = req.body.session_id;
    let attendance = req.body.attendance;
    console.log(session_id, attendance);


    // Select the student group of the session
    let getStudentGroup = async (session_id) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT Ses_group FROM sessions WHERE id = ' + session_id;
            conn.query(sql, (err, rows) => {
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(err);
                }
            })
        })
    }

    console.log("Loading student group");

    let studentGroup;
    try{
        studentGroup = await getStudentGroup(session_id);
    } catch(err) {
        console.log(err);
        res.send({ status: 500 });
        return;
    }

    if (studentGroup.length == 0 || studentGroup == null) {
        console.log("No student group found");
        res.send({ staus: 201 });
        return;
    }

    studentGroup = studentGroup[0].Ses_group;
    let updatingSQL = 'UPDATE attendance_' + studentGroup + ' SET ses' + session_id + ' = CASE ';

    let student_uid, attendance_time;
    let studentIDs = '';
    for (let studentAttendance of attendance) {
        student_uid = studentAttendance.substring(0, studentAttendance.length - 9);
        attendance_time = studentAttendance.substring(studentAttendance.length - 8);

        updatingSQL += 'WHEN Student = "' + student_uid + '" THEN "' + attendance_time + '" ';
        studentIDs += '"' + student_uid + '",';
    }

    updatingSQL += 'END WHERE Student IN (' + studentIDs.substring(0, studentIDs.length - 1) + ')';
    console.log(updatingSQL);

    let updateAttendance = async (updatingSQL) => {
        return new Promise((resolve, reject) => {
            conn.query(updatingSQL, (err, rows) => {
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(err);
                }
            })
        })
    }

    console.log("Updating attendance");
    let result;
    try{
        result = await updateAttendance(updatingSQL);
    } catch(err) {
        console.log(err);
        res.send({ status: 500 });
        return;
    }

    if(!result){
        console.log("Error updating attendance");
        res.send({ status: 201 });
        return;
    }else{
        console.log("Attendance updated");
        res.send({ status: 200 });
        return;
    }

}