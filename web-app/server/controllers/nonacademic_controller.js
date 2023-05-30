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

exports.today_view = async (req, res) => {
    console.log('Starting controller...');
    var employee_details = await loadInitialDetails();

    //let dayOfWeek = new Date().getDay().toLocaleString("en-UK", {timeZone: 'Asia/Kolkata'});

    let batches, degrees;

    try {
        batches = await commonFunctions.getBatchDetails(conn, null);
        console.log(batches);
    } catch (e) {
        console.log('Error : ' + e);
    }

    try {
        degrees = await commonFunctions.getDegreeDetails(conn, null);
        console.log(degrees);
    } catch (e) {
        console.log('Error : ' + e);
    }

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('nonacademic_today', { title: 'title', employee: employee_details, batches: batches, degrees: degrees });
}

exports.today_getsessions = async (req, res) => {
    let date = [];
    date.push(req.query.date);

    let batch = [];
    batch.push(req.query.batch);

    let groups = [];
    let sessions = [];

    try {
        sessions = await commonFunctions.getSessions(conn, date, 3);
        console.log('sessions of date');
        console.log(sessions);
    } catch (e) {
        console.log(e);
        res.send({ status: '500', sessions: [], groups: [] });
        return;
    }

    if (sessions.length == 0) {
        res.send({ status: '200', sessions: [], groups: [] });
        return;
    }

    let group_ids = []
    for (let session in sessions) {
        group_ids.push(sessions[session].Ses_group);
    }

    try {
        groups = await commonFunctions.getStudentGroupDetails(conn, batch, group_ids, 4);
        console.log('groups of date, batch');
        console.log(groups);
    } catch (e) {
        console.log(e);
        res.send({ status: '500', sessions: [], groups: [] });
        return;
    }

    if (groups.length == 0) {
        res.send({ status: '200', sessions: [], groups: [] });
        return;
    }

    let finalSessions = []; // This array includes sessions which are relevant to the batch and date

    // Adding sessions to finalSessions
    for (session in sessions) {
        for (group in groups) {
            if (sessions[session].Ses_group == groups[group].id) {
                finalSessions.push(sessions[session]);
            }
        }
    }

    // Loading module details of related modules of student groups
    let modules = [];

    for (group in groups) {
        modules.push(groups[group].Module);
    }

    try {
        modules = await commonFunctions.getModuleDetails(conn, modules);
        console.log('modules of relvant groups');
        console.log(modules);
    } catch (e) {
        console.log(e);
        res.send({ status: '500', sessions: [], groups: [] });
        return;
    }

    for (group in groups) {
        for (module in modules) {
            if (groups[group].Module == modules[module].id) {
                groups[group].Module = modules[module].Code + '<br>' + modules[module].Name;
            }
        }
    }

    res.send({ status: '200', sessions: finalSessions, groups: groups });
}

// LOAD EMPLOYEES (LECTURERS) WHO ARE ASSIGNED TO SPECIFIC GROUP
exports.today_loadEmployeesOfGroup = async (req, res) => {
    let group_id = req.query.group_id;

    let employees = [];

    try {
        employees = await commonFunctions.getEmployeesOfAGroup(conn, group_id);
        console.log('employees of group');
        console.log(employees);
    } catch (e) {
        console.log(e);
        res.send({ status: '500', employees: [] });
        return;
    }

    let emp_ids = [];
    for(emp in employees){
        emp_ids.push(employees[emp].Employee);
    }

    try{
        employees = await commonFunctions.getEmployeeDetails(conn, emp_ids,['id','Name']);
        console.log('employee details');
        console.log(employees);
    } catch(e){
        console.log(e);
        res.send({ status: '500', employees: [] });
        return;
    }

    res.send({ status: '200', employees: employees });
}

// ADD SESSION USING TIMETABLE ID AND EMPLOYEE ID
exports.today_addSession = async (req, res) => {
    let timeTableID = req.body.timeTableID;
    let employeeID = req.body.employeeID;
    let group = [];
    group.push(req.body.group);

    let timeTableRow;
    try{
        timeTableRow = await commonFunctions.getTimeTableUsingID(conn, timeTableID);
        console.log('timeTableRow');
        console.log(timeTableRow);
    } catch(e){
        console.log(e);
        res.send({ status: '500', error: e });
        return;
    }

    //let date = new Date().getDate().toLocaleString("en-UK", {timeZone: 'Asia/Kolkata'});
    //let d = date.getDate();
    let date = new Date();
    let dateString = date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2, "0") + '-' + date.getDate().toString().padStart(2, "0");
    timeTableRow[0].Start_time = dateString + ' ' + timeTableRow[0].Start_time;
    let Session = {
        Ses_group: timeTableRow[0].T_group,
        Start_time: '"' + timeTableRow[0].Start_time + '"',
        Duration: timeTableRow[0].Duration,
        Method: timeTableRow[0].Method,
        Type: timeTableRow[0].Type,
        Lecturer: employeeID,
    }

    let keys = Object.keys(Session);
    let values = Object.values(Session);
    console.log(keys);
    console.log(values);
    console.log(dateString);

    let result;
    try{
        result = await commonFunctions.addNewSession(conn,keys,values);
        console.log(result);
        result = result.insertId;
    } catch(e){
        console.log(e);
        res.send({ status: '500', error: e });
        return;
    }

    let result2;
    try{
        result2 = await commonFunctions.addNewSessionToAttendance(conn, group[0], result);
        console.log(result2);
    } catch(e){
        console.log('yes 1');
        try{
            console.log('yes 2');
            result2 = await commonFunctions.deleteSession(conn, result);
        } catch(e){
            console.log('yes 4');
            console.log(e);
            res.send({ status: '501', error: e });
            return;
        }
        console.log('yes 3')
        console.log(e);
        res.send({ status: '500', error: e });
        return;
    }

    console.log('yes 5');
    try{
        group = await commonFunctions.getStudentGroupDetails(conn, group, null, 1);
        console.log('group');
        console.log(group);
    } catch(e){
        console.log(e);
        res.send({ status: '201', session: result });
        return;
    }


    let modules = [];
    modules.push(group[0].Module);
    try{
        modules = await commonFunctions.getModuleDetails(conn, modules);
        console.log('module');
        console.log(modules);
    } catch(e){
        console.log(e);
        res.send({ status: '201', session: result });
        return;
    }

    res.send({status: '200', session: result, Start_time: values[1], module: modules});
    
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
            groups = await commonFunctions.getStudentGroupDetails(conn, id_list, null, 1);
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
        let present, session_count, percentage;
        for (let row in attendances) {
            present = 0;
            session_count = 0;
            for (let key in attendances[row][0]) {
                if (key != 'id' && key != 'Student') {
                    session_count++;
                    if (checkValidTimeStamp(attendances[row][0][key])) {
                        present++;
                    }
                }
            }
            (session_count == 0) ? percentage = 100 : percentage = (present / session_count) * 100;
            attendances[row].push({
                percentage: percentage,
                session_count: session_count,
            });
            //console.log(percentage + '%');
        }

        //console.log(attendances);
        console.log(attendances);
        console.log(student);
        res.render('nonacademic_student_profile', { employee: employee_details, student: student, modules: modules, groups: groups, attendance: attendances, sessions: sessions });
    }



}

// RETRIEVE VIEW RELATED TO PAST REPORTS SECTION
exports.past_reports_view = async (req, res) => {
    console.log('Function starting... get_past_reports');

    var employee_details, groups, modules, batches, degrees;

    employee_details = await loadInitialDetails();


    try {
        batches = await commonFunctions.getBatchDetails(conn, null);
        console.log(batches);
    } catch (e) {
        console.log('Error : ' + e);
    }

    try {
        modules = await commonFunctions.getModuleDetails(conn, null);
        console.log(modules);
    } catch (e) {
        console.log('Error : ' + e);
    }

    try {
        degrees = await commonFunctions.getDegreeDetails(conn, null);
        console.log(degrees);
    } catch (e) {
        console.log('Error : ' + e);
    }

    res.render('nonacademic_past_reports', { employee: employee_details, batches: batches, modules: modules, groups: groups, degrees: degrees });
}

// RETRIEVE GROUPS RELATED TO THE MODULE SELECTED BY THE USER
exports.past_get_groups = async (req, res) => {
    let module = req.query.module;
    let batch = req.query.batch;

    console.log(module)
    let modules = [module]
    let groups = [];

    try {
        groups = await commonFunctions.getStudentGroupDetails(conn, modules, null, 2);
        console.log(groups);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', groups: groups });
    }

    let matchingGroups = [];
    for (group in groups) {
        if (groups[group].Batch == batch) {
            matchingGroups.push(groups[group]);
        }
    }

    console.log(groups);
    res.send({ status: '200', groups: matchingGroups });

}

// RETRIEVE SESSIONS ACCORDING TO THE GIVEN BATCH, MODULE AND GROUP
exports.past_get_sessions = async (req, res) => {
    let group = req.query.group;

    let groups = [group], sessions, lecturers;

    try {
        sessions = await commonFunctions.getSessions(conn, groups, 1);
        console.log(sessions);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', sessions: sessions });
    }

    let lec_id = [];
    for(let session of sessions){
        lec_id.push(session.Lecturer);
    }

    lec_id = [...new Set(lec_id)];
    try{
        lecturers = await commonFunctions.getEmployeeDetails(conn, lec_id, ['id','Name']);
    } catch(e){
        console.log('Error : ' + e);
        res.send({ status: '500', sessions: sessions, lecturers: lecturers });
    }

    res.send({ status: '200', sessions: sessions, lecturers: lecturers });

}

exports.past_get_sessionattendance = async (req, res) => {
    let session = [];
    session.push(req.query.session);
    let group;
    let attendance = [];

    if (req.query.group == 'null') {
        try {
            session = await commonFunctions.getSessions(conn, session, 2);
            console.log(session);
        } catch (e) {
            console.log('Error : ' + e);
            res.send({ status: '500', attendance: [] });
            return;
        }

        group = session[0].Ses_group;
        session = session[0].id;
        
    } else {
        group = req.query.group;
        session = req.query.session;
    }

    try {
        attendance = await commonFunctions.getAttendanceofSession(conn, session, group);
        console.log(attendance);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', attendance: [] });
        return
    }

    if (attendance.length == 0) {
        res.send({ status: '200', attendance: [] });
        return
    }

    let students = [];
    for (student in attendance) {
        students.push([attendance[student].Student]);
    }

    try {
        students = await commonFunctions.getStudentsFiltered(conn, students, 0);
        console.log(students);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', attendance: [] });
        return;
    }

    for (row in attendance) {
        for (student in students) {
            if (students[student].id == attendance[row].Student) {
                attendance[row].Student = students[student].IndexNo;
                attendance[row].Degree = students[student].Degree;
                attendance[row].Name = students[student].Name;
            }
        }
    }

    res.send({ status: '200', attendance: attendance });

}

// GET REQUIRED DETAILS TO LOAD TIME TABLE SCREEN
exports.timetable_view = async (req, res) => {
    console.log('Function starting... get time table');

    var employee_details, degrees, batches;

    employee_details = await loadInitialDetails();


    try {
        batches = await commonFunctions.getBatchDetails(conn, null);
        console.log(batches);
    } catch (e) {
        console.log('Error : ' + e);
    }

    try {
        degrees = await commonFunctions.getDegreeDetails(conn, null);
        console.log(degrees);
    } catch (e) {
        console.log('Error : ' + e);
    }

    res.render('nonacademic_timetable', { employee: employee_details, batches: batches, degrees: degrees });
}

// GET LECTURES RELEVANT TO GIVEN DAY, BATCH AND DEGREE
exports.timetable_getlectures = async (req, res) => {
    let day = req.query.day;
    let batch = [];
    batch.push(req.query.batch);
    let degree = req.query.degree;
    console.log(day);

    let groups = [];

    try {
        groups = await commonFunctions.getStudentGroupDetails(conn, batch, null, 3);
        console.log('groups of the batch');
        console.log(groups);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', lectures: [] });
        return;
    }

    // Looking that the results are null
    if (groups.length == 0) {
        res.send({ status: '200', lectures: [] });
        return;
    }

    let group_ids = [], modules = [];
    for (group in groups) {
        group_ids.push(groups[group].id);
    }

    try {
        groups = await commonFunctions.getGroups_DegreeFiltered(conn, degree, group_ids);
        console.log('groups of the batch and degree');
        console.log(groups);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', lectures: [] });
        return;
    }

    // Looking that the results are null
    if (groups.length == 0) {
        res.send({ status: '200', lectures: [] });
        return;
    }

    group_ids = [];
    for (group in groups) {
        group_ids.push(groups[group].Stu_group);
    }

    let lectures = [];
    try {
        lectures = await commonFunctions.getTimeTable(conn, day, group_ids);
        console.log('time table of the batch, degree and day');
        console.log(lectures);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', lectures: [] });
        return;
    }

    // Looking that the results are null
    if (lectures.length == 0) {
        res.send({ status: '200', lectures: [] });
        return;
    }

    group_ids = [];
    for (lecture in lectures) {
        group_ids.push(lectures[lecture].T_group);
    }

    try {
        groups = await commonFunctions.getStudentGroupDetails(conn, group_ids, null, 1);
        console.log('groups that have lectures on the day in selected batch and degree');
        console.log(groups);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', lectures: [] });
        return;
    }

    if (groups.length == 0) {
        res.send({ status: '200', lectures: [] });
        return;
    }

    for (group in groups) {
        modules.push(groups[group].Module);
    }

    try {
        modules = await commonFunctions.getModuleDetails(conn, modules);
        console.log('modules of relvant groups');
        console.log(modules);
    } catch (e) {
        console.log('Error : ' + e);
        res.send({ status: '500', lectures: [] });
        return;
    }

    for (group in groups) {
        for (module in modules) {
            if (groups[group].Module == modules[module].id) {
                groups[group].Module = modules[module].Code + '<br>' + modules[module].Name;
            }
        }
    }
    res.send({ status: '200', lectures: lectures, groups: groups });
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

function checkValidTimeStamp(timestamp) {
    if (timestamp.length != 19) {
        return false;
    }
    if (timestamp.substring(4, 5) == '-' && timestamp.substring(7, 8) == '-' && timestamp.substring(13, 14) == ':' && timestamp.substring(16, 17) == ':') {
        return true;
    } else {
        return false;
    }
}


