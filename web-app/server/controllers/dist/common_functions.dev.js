"use strict";

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
  // faculties - array of faculty ids. [1,2,3]
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
}; // GET DETAILS OF A REQUIRED EMPLOYEE - GET COLUMNS WHICH ARE SPECIFIED IN COLUMNS PARAMETER USING THE IDs GIVEN IN PARAMS PARAMETER


exports.getEmployeeDetails = function (conn, params, columns) {
  return new Promise(function (resolve, reject) {
    var sql = 'SELECT ' + columns.join(',') + ' FROM employees WHERE id IN (' + params.join(',') + ') ORDER BY id ASC';
    console.log(sql);
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
}; // GET EMPLOYEES WHO ARE ASSIGNED TO A SPECIFIC GROUP AS id,Employee USING Emp_group from employees_of_groups


exports.getEmployeesOfAGroup = function (conn, group_id) {
  return new Promise(function (resolve, reject) {
    conn.query('SELECT id,Employee FROM employees_of_groups WHERE Emp_group = ' + group_id, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET DETAILS OF SELECTED STUDENT GROUPS


exports.getStudentGroupDetails = function (conn, filterArray, filterArray2, type) {
  /* type ==> 
  0 -> get all details
  type = 1 -> get according to id
  type = 2 -> get according to module
  type = 3 -> get according to batch
  TYPE = 4 -> get according to batch (filter array 1) and id (filter array 2)
  */
  return new Promise(function (resolve, reject) {
    var sql;

    if (type == 0) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups';
    } else if (type == 1) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE id IN (';
    } else if (type == 2) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE Module IN (';
    } else if (type == 3) {
      sql = 'SELECT id,Name,Module,Batch FROM student_groups WHERE Batch IN (';
    } else if (type = 4) {
      sql = 'SELECT id,Name,Module FROM student_groups WHERE Batch IN (';
    }

    if (type != 0) {
      filterArray.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ')';
    }

    if (type == 4) {
      sql += ' AND id IN (';
      filterArray2.forEach(function (element) {
        sql = sql + element + ',';
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ')';
    }

    console.log(sql);
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
  // index --> 0 - all, 1 - according to group, 2 - according to id, 3 - according to date
  return new Promise(function (resolve, reject) {
    var sql;

    if (index == 0) {
      sql = 'SELECT * FROM sessions';
    } else if (index == 1) {
      sql = 'SELECT * FROM sessions WHERE Ses_group IN (';
    } else if (index == 2) {
      sql = 'SELECT * FROM sessions WHERE id IN (';
    } else if (index == 3) {
      sql = 'SELECT * FROM sessions WHERE SUBSTRING(Start_time,1,10) IN (';
    }

    if (index != 0) {
      params.forEach(function (element) {
        if (index == 3) {
          sql = sql + "'" + element + "',";
        } else {
          sql = sql + element + ',';
        }
      });
      sql = sql.substring(0, sql.length - 1);
      sql = sql + ')';
    }

    console.log(sql);
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
      sql = 'SELECT id,IndexNo,Name,Degree,Batch FROM students WHERE indexNo IN (';
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
    sql = 'SELECT Stu_group FROM degree_of_groups WHERE Degree=' + degree + ' AND Stu_group IN (';
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
    console.log(groups);
    console.log(day);
    var sql;
    sql = 'SELECT id,T_group,Start_time,Duration,Method,Type,Session_repeat FROM timetable WHERE Day=' + day + ' AND T_group IN (';
    groups.forEach(function (element) {
      sql = sql + element + ',';
    });
    sql = sql.substring(0, sql.length - 1);
    sql = sql + ') ORDER BY Start_time ASC';
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // GET ROW OF THE TIME TABLE USING ITS ID


exports.getTimeTableUsingID = function (conn, id) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'SELECT id,T_group,Start_time,Duration,Method,Type,Session_repeat FROM timetable WHERE id=' + id;
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
}; // INSERT INTO SESSIONS TO COLUMNS OF PARAMETER KEYS AND VALUES AS PARAMETER VALUES


exports.addNewSession = function (conn, keys, values) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'INSERT INTO sessions (' + keys.join(',') + ') VALUES (' + values.join(',') + ')';
    console.log(sql);
    conn.query(sql, function (err, result) {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
}; // ALTER ATTENDANCE TABLE ACCORDING TO GROUP (attendance_groupno) AND ADD COLUMN FOR SESSION (ses_sessionno)


exports.addNewSessionToAttendance = function (conn, group, session) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'ALTER TABLE attendance_' + group + ' ADD ses' + session + ' varchar(20) NOT NULL DEFAULT "0" COMMENT "0 - absent, Timestamp - present, other(filename) - medical form"';
    console.log(sql);
    conn.query(sql, function (err, result) {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
}; // DELETE ROW FROM TABLE SESSIONS WHERE ID = PARAMETER SESSION_ID


exports.deleteSession = function (conn, session_id) {
  return new Promise(function (resolve, reject) {
    var sql;
    sql = 'DELETE FROM sessions WHERE id=' + session_id;
    conn.query(sql, function (err, result) {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};