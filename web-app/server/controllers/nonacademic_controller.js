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
    var employee_details = loadInitialDetails();

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('nonacademic_today', { title: 'title', employee: employee_details });
}

exports.sem_view = async (req, res) => {
    console.log('Starting controller...');
    var employee_details, modules = [], batches = [], departments = [];

    employee_details = loadInitialDetails();

    // RETRIEVING ALL MODULES
    try {
        modules = await commonFunctions.getModuleDetails(conn, null);
        console.log(modules);
    } catch (e) {
        console.log('Error : ' + e);
    }

    // RETRIEVING ALL DEPARTMENTS
    try {
        departments = await commonFunctions.getDepartments(conn, null);
        console.log(departments);
    } catch (e) {
        console.log('Error : ' + e);
    }

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('nonacademic_semester', { employee: employee_details, modules: modules, departments: departments });
}

exports.stu_view = async (req, res) => {
    console.log('Starting controller...');
    var employee_details, faculties = [], batches = [], degrees = [], students = [];

    employee_details = await loadInitialDetails();

    // RETRIEVING ALL FACULTIES
    try {
        faculties = await commonFunctions.getFaculties(conn, null);
        console.log(faculties);
    } catch (e) {
        console.log('Error : ' + e);
    }

    // RETRIEVING ALL BATCHES
    try {
        batches = await commonFunctions.getBatchDetails(conn, null);
        console.log(batches);
    } catch (e) {
        console.log('Error : ' + e);
    }

    // RETRIEVING ALL DEGREES   
    try {
        degrees = await commonFunctions.getDegreeDetails(conn, null);
        console.log(degrees);
    } catch (e) {
        console.log('Error : ' + e);
    }

    console.log('finishing...sssss');

    // RENDERING THE VIEW
    res.render('nonacademic_students', { employee: employee_details, faculties: faculties, batches: batches, degrees: degrees, students: students });
}

// RETRIEVE STUDENTS FILTERED BY FACULTY, BATCH AND DEGREE
exports.stu_get_filtered = async (req, res) => {
    let fac = req.query.faculty;
    let batch = req.query.batch;
    let deg = req.query.degree;

    let students = [];

    let sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch FROM students where Faculty = ' + fac;
    if (batch != 'all') {
        sql += ' AND Batch = ' + batch;
    }
    if (deg != 'all') {
        sql += ' AND Degree = ' + deg;
    }
    sql += ' ORDER BY id ASC';
    try {
        students = await new Promise((resolve, reject) => {
            conn.query(sql, (err, rows) => {
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(err);
                }
            });
        });

        res.send({ status: '200', students: students });
    } catch (e) {
        console.log(e);
        res.send({ status: '500', students: students });
    }


    //console.log('stu' + students);

}

// RETRIEVE A STUDENT BY SEARCHING USING INDEX, NAME OR EMAIL
exports.stu_get_bykeyword = async (req, res) => {
    let search_index = req.query.index;
    let search_keyword = req.query.keyword;
    console.log(search_index);
    let student;

    let sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch FROM students'

    /*switch (search_index) {
        case 0:
            console.log('starting');
            sql += ' WHERE IndexNo = "' + search_keyword + '"';
            break;
        case 1:
            sql += ' WHERE Name = "' + search_keyword + '"';
            break;
        case 2:
            sql += ' WHERE Email = "' + search_keyword + '"';
            break;
    }*/

    if(search_index==0){
        sql += ' WHERE IndexNo = "' + search_keyword + '"';
    }else if(search_index==1){
        sql += ' WHERE Name = "' + search_keyword + '"';
    }else if(search_index==2){
        sql += ' WHERE Email = "' + search_keyword + '"';
    }

    try {
        student = await new Promise((resolve, reject) => {
            conn.query(sql, (err, rows) => {
                if (!err) {
                    return resolve(rows);
                } else {
                    return reject(err);
                }
            });
        });

        if(student.length == 0){
            res.send({ status: '201'});
        }else{
            res.send({ status: '200', student: student });
        }
        
    } catch (e) {
        console.log(e);
        res.send({ status: '500', student: student });
    }
}

// RETRIEVE STUDENT PROFILE
exports.stu_get_profile = async (req, res) => {
    console.log('Starting controller...');
    var employee_details, faculties = [], batches = [], degrees = [];

    employee_details = await loadInitialDetails();

    res.render('nonacademic_student_profile', {employee: employee_details});
}

// GET DETAILS OF THE EMPLYEE ( PARAMS : ID OF THE EMPLOYEE, COLUMNS : COLUMNS WHICH ARE NEED TO BE RETRIEVED)
function getEmployeeDetails(id, columns) {
    let sql = 'SELECT ';
    columns.forEach(element => {
        sql = sql + element + ',';
    });
    sql = sql.substring(0, sql.length - 1);
    sql += ' FROM employees WHERE id=' + id;
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

// GET EMPLOYEE DETAILS, MATCHING DESIGNATIONS
async function loadInitialDetails(){
    var employee_details, designations;

    // RETRIEVING ID AND THE DESIGNATION OF THE EMPLOYEE
    try {
        employee_details = await getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']);
        console.log(employee_details);
    } catch (e) {
        console.log('Error : ' + e);
    }

    // RETRIEVING ALL DESIGNATIONS
    try {
        designations = await commonFunctions.getDesignations(conn);
        console.log(designations);
    } catch (e) {
        console.log('Error : ' + e);
    }

    // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
    designations.forEach(element => {
        if (element.id == employee_details[0].Designation) {
            employee_details[0].Designation = element.Name;
            return;
        }
    })

    return employee_details;
}

