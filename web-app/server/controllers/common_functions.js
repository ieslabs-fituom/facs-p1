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
        conn.query('SELECT * FROM designations', (err, rows) => {
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
        let sql = 'SELECT id,Code,Name,Faculty,Department FROM modules WHERE id IN (';
        modules.forEach(element => {
            sql = sql + element + ',';
        });
        sql = sql.substring(0,sql.length-1);
        sql = sql + ')';
        conn.query(sql,(err,rows) => {
            if(!err){
                return resolve(rows);
            }else{
                return reject(err);
            }
        })
    })
}

exports.getBatchDetails = (conn, batches) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT id,Batch FROM batches WHERE id IN (';
        batches.forEach(element => {
            sql = sql + element + ',';
        });
        sql = sql.substring(0,sql.length-1);
        sql = sql + ')';
        conn.query(sql,(err,rows) => {
            if(!err){
                return resolve(rows);
            }else{
                return reject(err);
            }
        })
    })
}

// GET GROUPS OF EMPLOYEES USING EMPLOYEE ID
exports.getGroupsofEmployee = (conn, employee_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id,Emp_group FROM employees_of_groups WHERE Employee = ' + employee_id, (err, rows) => {
            if(!err){
                return resolve(rows);
            }else{
                return reject(err);
            }
        })
    })
}

// GET DETAILS OF SELECTED STUDENT GROUPS
exports.getStudenGroupDetails = (conn,StudentGroups) => {
    return new Promise((resolve,reject) => {
        let sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE id IN (';
        StudentGroups.forEach(element => {
            sql = sql + element.Emp_group + ',';
        });
        sql = sql.substring(0,sql.length-1);
        sql = sql + ')';
        conn.query(sql,(err,rows) => {
            if(!err){
                return resolve(rows);
            }else{
                return reject(err);
            }
        })
    })
}