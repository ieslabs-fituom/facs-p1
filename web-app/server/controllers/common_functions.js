const mysql = require('mysql2');

/* 
*   THIS CONTROLLER IS USED TO DEFINE COMMONLY USED FUNCTIONS
*   EX : LOADING ALL DESTINATIONS, LOADING ALL FACULTIES, LOADING ALL DEPARTMENTS OF A PARTICULAR FACULTY
*   ALWAYS SEND CONNECTION AS A PARAMETER TO THE COMMON FUNCTION FROM THE CONTROLLER
*   CREATE FUNCTIONS AS MINIMIZING THE CODE (USE COLUMN LISTS TO RETRIEVE ONLY REQUIRED COLUMNS)
*/


// GET ALL DESIGNATIONS
exports.getDesignations = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM designations ORDER BY id ASC', (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

// GET ALL FACULTIES
exports.getFaculties = (conn, faculties) => {
    return new Promise((resolve, reject) => {
        let sql;
        if (faculties != null) {
            sql = 'SELECT * FROM faculties WHERE id IN (';
            faculties.forEach(element => {
                sql = sql + element + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql = sql + ') ORDER BY id ASC';
        } else {
            sql = 'SELECT * FROM faculties ORDER BY id ASC';
        }
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

// GET ALL DEPARTMENTS
exports.getDepartments = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM departments ORDER BY id ASC', (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

// GET DETAILS OF A REQUIRED MODULE
exports.getModuleDetails = (conn, modules) => {
    return new Promise((resolve, reject) => {
        let sql;
        if (modules != null) {
            sql = 'SELECT id,Code,Name,Faculty,Department FROM modules WHERE id IN (';
            modules.forEach(element => {
                sql = sql + element + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql = sql + ') ORDER BY id ASC';
        } else {
            sql = 'SELECT * FROM modules ORDER BY id ASC';
        }
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

exports.getBatchDetails = (conn, batches) => {
    return new Promise((resolve, reject) => {
        let sql;
        if (batches != null) {
            sql = 'SELECT id,Batch FROM batches WHERE id IN (';
            batches.forEach(element => {
                sql = sql + element + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql = sql + ') ORDER BY id ASC';
        } else {
            sql = 'SELECT * FROM batches ORDER BY id ASC';
        }
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

exports.getDegreeDetails = (conn, degrees) => {
    return new Promise((resolve, reject) => {
        let sql;
        if (degrees != null) {
            sql = 'SELECT id,Degree FROM degrees WHERE id IN (';
            degrees.forEach(element => {
                sql = sql + element + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql = sql + ') ORDER BY id ASC';
        } else {
            sql = 'SELECT * FROM degrees ORDER BY id ASC';
        }
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

// GET GROUPS OF EMPLOYEES USING EMPLOYEE ID
exports.getGroupsofEmployee = (conn, employee_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id,Emp_group FROM employees_of_groups WHERE Employee = ' + employee_id, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

// GET DETAILS OF SELECTED STUDENT GROUPS
exports.getStudentGroupDetails = (conn, filterArray, type) => { // type = 0 -> get all details, type = 1 -> get according to id, type = 2 -> get according to module, type = 3 -> get according to batch
    return new Promise((resolve, reject) => {
        let sql;
        if (type == 0) {
            sql = 'SELECT id,Name,Module,Batch FROM student_groups';
        } else if (type == 1) {
            sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE id IN (';
        } else if (type == 2){
            sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE Module IN (';
        } else{
            sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE Batch IN (';
        }
        if (type != 0) {
            filterArray.forEach(element => {
                sql = sql + element + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql = sql + ')';
        }

        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

// GET GROUPS OF A STUDENTS
exports.getGroupsOfAStudent = (conn, Student) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT id,Stu_group FROM groups_for_students WHERE Student = ' + Student;
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

exports.getSessions = (conn, params, index) => {
    return new Promise((resolve, reject) => {
        let sql;
        if (index == 0) {
            sql = 'SELECT * FROM sessions';
        } else if (index == 1) {
            sql = 'SELECT * FROM sessions WHERE Ses_group IN (';
        } else if (index == 2) {
            sql = 'SELECT * FROM sessions WHERE id IN (';
        }
        if (index != 0) {
            params.forEach(element => {
                sql = sql + element + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql = sql + ')';
        }

        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

exports.getAttendanceRow = (conn, student, group) => {
    return new Promise((resolve, reject) => {
        let sql;
        sql = 'SELECT * FROM attendance_' + group + ' WHERE Student = ' + student;
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        })
    })
}

exports.getAttendanceofSession = (conn, session, group) => {
    return new Promise((resolve, reject) => {
        let sql;
        sql = 'SELECT id,Student,ses' + session + ' FROM attendance_' + group;
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

exports.getStudentsFiltered = (conn, params, index) => { //index -> 0 - id, 1 - index no
    return new Promise((resolve, reject) => {

        let sql;
        if(index==0){
            sql = 'SELECT id,IndexNo,Name FROM students WHERE id IN (';
        }else if(index ==1){
            sql = 'SELECT id,IndexNo,Name FROM students WHERE id IN (';
        }
        
        params.forEach(element => {
            sql = sql + element + ',';
        });
        sql = sql.substring(0, sql.length - 1);
        sql = sql + ')';

        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

// RETRIEVE GROUPS WHICH ARE MATCHING TO THE GIVEN DEGREE AND INCLUDED IN GIVEN GROUPS LIST
exports.getGroups_DegreeFiltered = (conn, degree, groups) => {
    return new Promise((resolve, reject) => {
        let sql;
        sql = 'SELECT Stu_group FROM degree_of_groups WHERE Degree=' + degree + ' AND Stu_groups IN (';
        groups.forEach(element => {
            sql = sql + element + ',';
        });
        sql = sql.substring(0, sql.length - 1);
        sql = sql + ')';

        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

exports.getTimeTable = (conn,day,groups) => {
    return new Promise((resolve,reject) => {
        let sql;
        sql = 'SELECT id,T_group,Start_time,Duration WHERE Day=' + day + ' AND T_group IN (';
        groups.forEach(element => {
            sql = sql + element + ',';
        });
        sql = sql.substring(0, sql.length - 1);
        sql = sql + ')';

        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}