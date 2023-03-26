"use strict";

var mysql = require('mysql2');
/* 
*   THIS CONTROLLER IS USED TO DEFINE COMMONLY USED FUNCTIONS
*   EX : LOADING ALL DESTINATIONS, LOADING ALL FACULTIES, LOADING ALL DEPARTMENTS OF A PARTICULAR FACULTY
*   ALWAYS SEND CONNECTION AS A PARAMETER TO THE COMMON FUNCTION FROM THE CONTROLLER
*   CREATE FUNCTIONS AS MINIMIZING THE CODE (USE COLUMN LISTS TO RETRIEVE ONLY REQUIRED COLUMNS)
*/
// GET ALL DESIGNATIONS


exports.getDesignations = function (conn) {
  return new Promise(function (resolve, reject) {
    conn.query('SELECT * FROM designations ORDER BY id ASC', function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET ALL FACULTIES


exports.getFaculties = function (conn, faculties) {
  return new Promise(function (resolve, reject) {
    var sql;

    if (faculties != null) {
      sql = 'SELECT * FROM faculties WHERE id IN (';
      faculties.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ') ORDER BY id ASC';
    } else {
      sql = 'SELECT * FROM faculties ORDER BY id ASC';
    }

    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET ALL DEPARTMENTS


exports.getDepartments = function (conn) {
  return new Promise(function (resolve, reject) {
    conn.query('SELECT * FROM departments ORDER BY id ASC', function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET DETAILS OF A REQUIRED MODULE


exports.getModuleDetails = function (conn, modules) {
  return new Promise(function (resolve, reject) {
    var sql;

    if (modules != null) {
      sql = 'SELECT id,Code,Name,Faculty,Department FROM modules WHERE id IN (';
      modules.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ') ORDER BY id ASC';
    } else {
      sql = 'SELECT * FROM modules ORDER BY id ASC';
    }

    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
};

exports.getBatchDetails = function (conn, batches) {
  return new Promise(function (resolve, reject) {
    var sql;

    if (batches != null) {
      sql = 'SELECT id,Batch FROM batches WHERE id IN (';
      batches.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ') ORDER BY id ASC';
    } else {
      sql = 'SELECT * FROM batches ORDER BY id ASC';
    }

    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
};

exports.getDegreeDetails = function (conn, degrees) {
  return new Promise(function (resolve, reject) {
    var sql;

    if (degrees != null) {
      sql = 'SELECT id,Degree FROM degrees WHERE id IN (';
      degrees.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ') ORDER BY id ASC';
    } else {
      sql = 'SELECT * FROM degrees ORDER BY id ASC';
    }

    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET GROUPS OF EMPLOYEES USING EMPLOYEE ID


exports.getGroupsofEmployee = function (conn, employee_id) {
  return new Promise(function (resolve, reject) {
    conn.query('SELECT id,Emp_group FROM employees_of_groups WHERE Employee = ' + employee_id, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET DETAILS OF SELECTED STUDENT GROUPS


exports.getStudentGroupDetails = function (conn, StudentGroups) {
  return new Promise(function (resolve, reject) {
    var sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE id IN (';
    StudentGroups.forEach(function (element) {
      sql = sql + element + ',';
    });
    sql = sql.substring(0, sql.length - 1);
    sql = sql + ')';
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET GROUPS OF A STUDENTS


exports.getGroupsOfAStudent = function (conn, Student) {
  return new Promise(function (resolve, reject) {
    var sql = 'SELECT id,Stu_group FROM groups_for_students WHERE Student = ' + Student;
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
};

exports.getSessions = function (conn, params, index) {
  return new Promise(function (resolve, reject) {
    var sql;

    if (index == 0) {
      sql = 'SELECT * FROM sessions';
    } else if (index == 1) {
      sql = 'SELECT * FROM sessions WHERE Ses_group IN (';
    }

    if (index != 0) {
      params.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ')';
    }

    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
};

exports.getAttendanceRow = function (conn, student, group) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'SELECT * FROM attendance_' + group + ' WHERE Student = ' + student;
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
};