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


exports.getStudentGroupDetails = function (conn, filterArray, type) {
  // type = 0 -> get all details, type = 1 -> get according to id, type = 2 -> get according to module, type = 3 -> get according to batch
  return new Promise(function (resolve, reject) {
    var sql;

    if (type == 0) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups';
    } else if (type == 1) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE id IN (';
    } else if (type == 2) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE Module IN (';
    } else {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE Batch IN (';
    }

    if (type != 0) {
      filterArray.forEach(function (element) {
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
    } else if (index == 2) {
      sql = 'SELECT * FROM sessions WHERE id IN (';
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

exports.getAttendanceofSession = function (conn, session, group) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'SELECT id,Student,ses' + session + ' FROM attendance_' + group;
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
};

exports.getStudentsFiltered = function (conn, params, index) {
  //index -> 0 - id, 1 - index no
  return new Promise(function (resolve, reject) {
    var sql;

    if (index == 0) {
      sql = 'SELECT id,IndexNo,Name,Degree,Batch FROM students WHERE id IN (';
    } else if (index == 1) {
      sql = 'SELECT id,IndexNo,Name,Degree,Batch FROM students WHERE id IN (';
    }

    params.forEach(function (element) {
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
}; // RETRIEVE GROUPS WHICH ARE MATCHING TO THE GIVEN DEGREE AND INCLUDED IN GIVEN GROUPS LIST


exports.getGroups_DegreeFiltered = function (conn, degree, groups) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'SELECT Stu_group FROM degree_of_groups WHERE Degree=' + degree + ' AND Stu_groups IN (';
    groups.forEach(function (element) {
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
};

exports.getTimeTable = function (conn, day, groups) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'SELECT id,T_group,Start_time,Duration WHERE Day=' + day + ' AND T_group IN (';
    groups.forEach(function (element) {
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
};