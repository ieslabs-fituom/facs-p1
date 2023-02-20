const mysql = require('mysql2');
const commonFunctions = require('./common_functions');

// MYSQL CONNECTION (CHANGE .env FILE WHEN TESTING. DON'T EDIT THESE PARAMETERS)
let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_TOKEN,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

exports.view = async (req, res) => {
    console.log('Starting controller...');
    var employee_details, designations;

    // RETRIEVING ID AND THE DESIGNATION OF THE EMPLOYEE
    try{
        employee_details = await getEmployeeDetails(process.env.CURRENT_ID,['Name','Designation']);
        console.log(employee_details);
    }catch(e){
        console.log('Error : ' + e);
    }
    
    // RETRIEVING ALL DESIGNATIONS
    try{
        designations = await commonFunctions.getDesignations(conn);
        console.log(designations);
    }catch(e){
        console.log('Error : ' + e);
    }

    // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
    designations.forEach(element => {
        if(element.id == employee_details[0].Designation){
            employee_details[0].Designation = element.Name;
            return;
        }
    })

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('sample_view_2', { title: 'title', employee: employee_details });
}

exports.get_dept = (req, res) => {
    console.log('Function accessed...');
    conn.query('SELECT * FROM departments WHERE Faculty = ' + req.params.fac, (err, rows) => {
        (!err) ? console.log(rows) : console.log(err);
    });
}

// GET DETAILS OF THE EMPLYEE ( PARAMS : ID OF THE EMPLOYEE, COLUMNS : COLUMNS WHICH ARE NEED TO BE RETRIEVED)
function getEmployeeDetails(id,columns){
    let sql = 'SELECT ';
    columns.forEach(element => {
        sql = sql + element + ',';
    });
    sql = sql.substring(0,sql.length-1);
    sql += ' FROM employees WHERE id=' + id;
    return new Promise((resolve,reject) => {
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

