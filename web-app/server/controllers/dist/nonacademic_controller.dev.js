"use strict";

var mysql = require('mysql2');

var commonFunctions = require('./common_functions'); // MYSQL CONNECTION (CHANGE .env FILE WHEN TESTING. DON'T EDIT THESE PARAMETERS)


var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_TOKEN,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

exports.view = function _callee(req, res) {
  var employee_details;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Starting controller...');
          _context.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context.sent;
          console.log('finishing...'); // RENDERING THE VIEW

          res.render('nonacademic_today', {
            title: 'title',
            employee: employee_details
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sem_view = function _callee2(req, res) {
  var employee_details, modules, batches, departments;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('Starting controller...');
          modules = [], batches = [], departments = [];
          _context2.next = 4;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 4:
          employee_details = _context2.sent;
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 8:
          modules = _context2.sent;
          console.log(modules);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](5);
          console.log('Error : ' + _context2.t0);

        case 15:
          _context2.prev = 15;
          _context2.next = 18;
          return regeneratorRuntime.awrap(commonFunctions.getDepartments(conn, null));

        case 18:
          departments = _context2.sent;
          console.log(departments);
          _context2.next = 25;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t1 = _context2["catch"](15);
          console.log('Error : ' + _context2.t1);

        case 25:
          console.log('finishing...'); // RENDERING THE VIEW

          res.render('nonacademic_semester', {
            employee: employee_details,
            modules: modules,
            departments: departments
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 12], [15, 22]]);
};

exports.stu_view = function _callee3(req, res) {
  var employee_details, faculties, batches, degrees, students;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('Starting controller...');
          faculties = [], batches = [], degrees = [], students = [];
          _context3.next = 4;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 4:
          employee_details = _context3.sent;
          _context3.prev = 5;
          _context3.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getFaculties(conn, null));

        case 8:
          faculties = _context3.sent;
          console.log(faculties);
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](5);
          console.log('Error : ' + _context3.t0);

        case 15:
          _context3.prev = 15;
          _context3.next = 18;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 18:
          batches = _context3.sent;
          console.log(batches);
          _context3.next = 25;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t1 = _context3["catch"](15);
          console.log('Error : ' + _context3.t1);

        case 25:
          _context3.prev = 25;
          _context3.next = 28;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 28:
          degrees = _context3.sent;
          console.log(degrees);
          _context3.next = 35;
          break;

        case 32:
          _context3.prev = 32;
          _context3.t2 = _context3["catch"](25);
          console.log('Error : ' + _context3.t2);

        case 35:
          console.log('finishing...sssss'); // RENDERING THE VIEW

          res.render('nonacademic_students', {
            employee: employee_details,
            faculties: faculties,
            batches: batches,
            degrees: degrees,
            students: students
          });

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 12], [15, 22], [25, 32]]);
}; // RETRIEVE STUDENTS FILTERED BY FACULTY, BATCH AND DEGREE


exports.stu_get_filtered = function _callee4(req, res) {
  var fac, batch, deg, students, sql;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          //res.redirect('/nac/stuprofile');
          fac = req.query.faculty;
          batch = req.query.batch;
          deg = req.query.degree;
          students = [];
          sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch FROM students where Faculty = ' + fac;

          if (batch != 'all') {
            sql += ' AND Batch = ' + batch;
          }

          if (deg != 'all') {
            sql += ' AND Degree = ' + deg;
          }

          sql += ' ORDER BY id ASC';
          _context4.prev = 8;
          _context4.next = 11;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            conn.query(sql, function (err, rows) {
              if (!err) {
                return resolve(rows);
              } else {
                return reject(err);
              }
            });
          }));

        case 11:
          students = _context4.sent;
          res.send({
            status: '200',
            students: students
          });
          _context4.next = 19;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](8);
          console.log(_context4.t0);
          res.send({
            status: '500',
            students: students
          });

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[8, 15]]);
};

exports.stu_get_profile = function _callee6(req, res) {
  var search_index, search_keyword, employee_details, student, groups, modules, sessions, attendances, sql, id_list, row;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('Function starting... stu profile');
          search_index = req.query.searchoption;
          search_keyword = req.query.keyword;
          _context6.next = 5;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 5:
          employee_details = _context6.sent;
          sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch FROM students';

          if (search_index == 0) {
            sql += ' WHERE IndexNo = "' + search_keyword + '"';
          } else if (search_index == 1) {
            sql += ' WHERE Name = "' + search_keyword + '"';
          } else if (search_index == 2) {
            sql += ' WHERE Email = "' + search_keyword + '"';
          }

          _context6.prev = 8;
          _context6.next = 11;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            conn.query(sql, function (err, rows) {
              if (!err) {
                return resolve(rows);
              } else {
                return reject(err);
              }
            });
          }));

        case 11:
          student = _context6.sent;
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](8);
          console.log(_context6.t0);
          res.send({
            status: '500',
            student: student
          });

        case 18:
          if (!(student.length == 0)) {
            _context6.next = 24;
            break;
          }

          //res.send({ status: '201' });
          console.log('yes');
          res.status(201).send({
            res: 'No such students'
          });
          return _context6.abrupt("return");

        case 24:
          _context6.prev = 24;
          _context6.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getGroupsOfAStudent(conn, student[0].id));

        case 27:
          groups = _context6.sent;
          console.log(groups);
          _context6.next = 34;
          break;

        case 31:
          _context6.prev = 31;
          _context6.t1 = _context6["catch"](24);
          console.log('Error : ' + _context6.t1);

        case 34:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Stu_group);
          }); // RETRIEVING ALL GROUPS RELEVANT TO THE STUDENT

          _context6.prev = 36;
          _context6.next = 39;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, id_list));

        case 39:
          groups = _context6.sent;
          console.log(groups);
          _context6.next = 46;
          break;

        case 43:
          _context6.prev = 43;
          _context6.t2 = _context6["catch"](36);
          console.log('Error : ' + _context6.t2);

        case 46:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Module);
          }); // RETRIEVING ALL MODULES RELEVANT TO THE STUDENT

          _context6.prev = 48;
          _context6.next = 51;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, id_list));

        case 51:
          modules = _context6.sent;
          console.log(modules);
          _context6.next = 58;
          break;

        case 55:
          _context6.prev = 55;
          _context6.t3 = _context6["catch"](48);
          console.log('Error : ' + _context6.t3);

        case 58:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.id);
          }); // RETRIEVING ALL SESSIONS RELEVANT TO THE GROUPS

          _context6.prev = 60;
          _context6.next = 63;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, id_list, 1));

        case 63:
          sessions = _context6.sent;
          console.log(sessions);
          _context6.next = 70;
          break;

        case 67:
          _context6.prev = 67;
          _context6.t4 = _context6["catch"](60);
          console.log('Error : ' + _context6.t4);

        case 70:
          //RETIEVING ALL ATTENDANCE ROWS OF SELECTED STUDENT RELEVANT TO EACH STUDENT GROUP
          attendances = [];
          row = [];
          groups.forEach(function _callee5(element) {
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.prev = 0;
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, element.id));

                  case 3:
                    row = _context5.sent;
                    row.push({
                      group: element.id
                    });
                    console.log(row);
                    attendances.push(row);
                    _context5.next = 12;
                    break;

                  case 9:
                    _context5.prev = 9;
                    _context5.t0 = _context5["catch"](0);
                    console.log('Error : ' + _context5.t0);

                  case 12:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[0, 9]]);
          });
          console.log(attendances);
          console.log(student);
          res.render('nonacademic_student_profile', {
            employee: employee_details,
            student: student
          });

        case 76:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[8, 14], [24, 31], [36, 43], [48, 55], [60, 67]]);
}; // GET DETAILS OF THE EMPLYEE ( PARAMS : ID OF THE EMPLOYEE, COLUMNS : COLUMNS WHICH ARE NEED TO BE RETRIEVED)


function getEmployeeDetails(id, columns) {
  var sql = 'SELECT ';
  columns.forEach(function (element) {
    sql = sql + element + ',';
  });
  sql = sql.substring(0, sql.length - 1);
  sql += ' FROM employees WHERE id=' + id;
  return new Promise(function (resolve, reject) {
    conn.query(sql, function (err, rows) {
      if (!err) {
        return resolve(rows);
      } else {
        return reject(err);
      }
    });
  });
} // GET EMPLOYEE DETAILS, MATCHING DESIGNATIONS


function loadInitialDetails() {
  var employee_details, designations;
  return regeneratorRuntime.async(function loadInitialDetails$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']));

        case 3:
          employee_details = _context7.sent;
          console.log(employee_details);
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.log('Error : ' + _context7.t0);

        case 10:
          _context7.prev = 10;
          _context7.next = 13;
          return regeneratorRuntime.awrap(commonFunctions.getDesignations(conn));

        case 13:
          designations = _context7.sent;
          console.log(designations);
          _context7.next = 20;
          break;

        case 17:
          _context7.prev = 17;
          _context7.t1 = _context7["catch"](10);
          console.log('Error : ' + _context7.t1);

        case 20:
          // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
          designations.forEach(function (element) {
            if (element.id == employee_details[0].Designation) {
              employee_details[0].Designation = element.Name;
              return;
            }
          });
          return _context7.abrupt("return", employee_details);

        case 22:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7], [10, 17]]);
}