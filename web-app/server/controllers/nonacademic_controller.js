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
    var employee_details = await loadInitialDetails();

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('nonacademic_today', { title: 'title', employee: employee_details });
}

exports.sem_view = async (req, res) => {
    console.log('Starting controller...');
    var employee_details, modules = [], batches = [], departments = [];

    employee_details = await loadInitialDetails();

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

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('nonacademic_students', { employee: employee_details, faculties: faculties, batches: batches, degrees: degrees, students: students });
}

// RETRIEVE STUDENTS FILTERED BY FACULTY, BATCH AND DEGREE
exports.stu_get_filtered = async (req, res) => {

    //res.redirect('/nac/stuprofile');
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


exports.stu_get_profile = async (req, res) => {
    console.log('Function starting... stu profile');

    let search_index = req.query.searchoption;
    let search_keyword = req.query.keyword;

    var employee_details, student, groups, modules, sessions, attendances;

    employee_details = await loadInitialDetails();

    let sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch,Telephone,Address FROM students';

    if (search_index == 0) {
        sql += ' WHERE IndexNo = "' + search_keyword + '"';
    } else if (search_index == 1) {
        sql += ' WHERE Name = "' + search_keyword + '"';
    } else if (search_index == 2) {
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

    } catch (e) {
        console.log(e);
        res.send({ status: '500', student: student });
    }

    if (student.length == 0) {
        res.status(201).send({ res: 'No such students' });
        return;
    } else {
        //RETRIEVING DEGREE OF THE STUDENT
        let degree = [student[0].Degree];

        let deg, bat;
        try {
            deg = await commonFunctions.getDegreeDetails(conn, degree);
            student[0].Degree = deg[0].Degree;
        } catch (e) {
            console.log('Error : ' + e);
        }

        //RETRIEVING Batch OF THE STUDENT
        let batch = [student[0].Batch];
        try {
            bat = await commonFunctions.getBatchDetails(conn, batch);
            student[0].Batch = bat[0].Batch
        } catch (e) {
            console.log('Error : ' + e);
        }

        // RETRIEVING ALL GROUPS OF THE STUDENT
        try {
            groups = await commonFunctions.getGroupsOfAStudent(conn, student[0].id);
            console.log("Student Groups");
            console.log(groups);
        } catch (e) {
            console.log('Error : ' + e);
        }

        let id_list = [];

        groups.forEach(element => {
            id_list.push(element.Stu_group);
        });

        // RETRIEVING ALL GROUPS RELEVANT TO THE STUDENT
        try {
            groups = await commonFunctions.getStudentGroupDetails(conn, id_list);
            console.log(groups);
        } catch (e) {
            console.log('Error : ' + e);
        }

        id_list = [];
        groups.forEach(element => {
            id_list.push(element.Module);
        });

        // RETRIEVING ALL MODULES RELEVANT TO THE STUDENT
        try {
            modules = await commonFunctions.getModuleDetails(conn, id_list);
            console.log(modules);
        } catch (e) {
            console.log('Error : ' + e);
        }

        id_list = [];
        groups.forEach(element => {
            id_list.push(element.id);
        });

        // RETRIEVING ALL SESSIONS RELEVANT TO THE GROUPS
        try {
            sessions = await commonFunctions.getSessions(conn, id_list, 1);
            console.log(sessions);
        } catch (e) {
            console.log('Error : ' + e);
        }

        //RETIEVING ALL ATTENDANCE ROWS OF SELECTED STUDENT RELEVANT TO EACH STUDENT GROUP
        attendances = [];
        let row = [];

        const attendanceLoop = async _ => {
            for (grp in groups) {
                try {
                    row = await commonFunctions.getAttendanceRow(conn, student[0].id, groups[grp].id);
                    row.push({
                        group: groups[grp].id,
                    });
                    //console.log(row);
                    attendances.push(row);
                } catch (e) {
                    console.log('Error : ' + e);
                }
            }
        }

        await attendanceLoop();
        let present,session_count,percentage;
        for(let row in attendances){
            present = 0;
            session_count = 0;
            for(let key in attendances[row][0]){
                if(key != 'id' && key != 'Student'){
                    session_count++;
                    if(checkValidTimeStamp(attendances[row][0][key])){
                        present++;
                    }
                }
            }
            (session_count==0)? percentage=100:percentage=(present/session_count)*100;
            attendances[row].push({
                percentage: percentage,
                session_count: session_count,
            });
            //console.log(percentage + '%');
        }

        //console.log(attendances);
        console.log(attendances);
        console.log(student);
        res.render('nonacademic_student_profile', { employee: employee_details, student: student, modules: modules, groups: groups, attendance: attendances, sessions: sessions});
    }



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

async function load_attendance_of_a_student(groups) {
    let attendances = [];
    let row = [];
    groups.forEach(async element => {
        try {
            row = await commonFunctions.getAttendanceRow(conn, student[0].id, element.id);
            row.push({
                group: element.id,
            });
            console.log(row);
            attendances.push(row);
        } catch (e) {
            console.log('Error : ' + e);
        }
    });
}

// GET EMPLOYEE DETAILS, MATCHING DESIGNATIONS
async function loadInitialDetails() {
    var employee_details, designations;

    // RETRIEVING ID AND THE DESIGNATION OF THE EMPLOYEE
    try {
        employee_details = await getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']);
        //console.log(employee_details);
    } catch (e) {
        console.log('Error : ' + e);
    }

    // RETRIEVING ALL DESIGNATIONS
    try {
        designations = await commonFunctions.getDesignations(conn);
        //console.log(designations);
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

function checkValidTimeStamp(timestamp){
    if(timestamp.length!=19){
        return false;
    }
    if(timestamp.substring(4,5) == '-' && timestamp.substring(7,8) == '-' && timestamp.substring(13,14) == ':' && timestamp.substring(16,17) == ':'){
        return true;
    }else{
        return false;
    }
}
