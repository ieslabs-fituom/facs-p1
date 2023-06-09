"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var mysql = require('mysql2');

var commonFunctions = require('./common_functions'); // MYSQL CONNECTION (CHANGE .env FILE WHEN TESTING. DON'T EDIT THESE PARAMETERS)


var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_TOKEN,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

exports.today_view = function _callee(req, res) {
  var employee_details, batches, degrees;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Starting controller...');
          _context.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context.sent;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context.sent;
          console.log(batches);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          console.log('Error : ' + _context.t0);

        case 14:
          _context.prev = 14;
          _context.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 17:
          degrees = _context.sent;
          console.log(degrees);
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t1 = _context["catch"](14);
          console.log('Error : ' + _context.t1);

        case 24:
          console.log('finishing...'); // RENDERING THE VIEW

          res.render('nonacademic_today', {
            title: 'title',
            employee: employee_details,
            batches: batches,
            degrees: degrees
          });

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
};

exports.today_getsessions = function _callee2(req, res) {
  var date, batch, groups, sessions, group_ids, _session, finalSessions, modules;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          date = [];
          date.push(req.query.date);
          batch = [];
          batch.push(req.query.batch);
          groups = [];
          sessions = [];
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, date, 3));

        case 9:
          sessions = _context2.sent;
          console.log('sessions of date');
          console.log(sessions);
          _context2.next = 19;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](6);
          console.log(_context2.t0);
          res.send({
            status: '500',
            sessions: [],
            groups: []
          });
          return _context2.abrupt("return");

        case 19:
          if (!(sessions.length == 0)) {
            _context2.next = 22;
            break;
          }

          res.send({
            status: '200',
            sessions: [],
            groups: []
          });
          return _context2.abrupt("return");

        case 22:
          group_ids = [];

          for (_session in sessions) {
            group_ids.push(sessions[_session].Ses_group);
          }

          _context2.prev = 24;
          _context2.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, batch, group_ids, 4));

        case 27:
          groups = _context2.sent;
          console.log('groups of date, batch');
          console.log(groups);
          _context2.next = 37;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t1 = _context2["catch"](24);
          console.log(_context2.t1);
          res.send({
            status: '500',
            sessions: [],
            groups: []
          });
          return _context2.abrupt("return");

        case 37:
          if (!(groups.length == 0)) {
            _context2.next = 40;
            break;
          }

          res.send({
            status: '200',
            sessions: [],
            groups: []
          });
          return _context2.abrupt("return");

        case 40:
          finalSessions = []; // This array includes sessions which are relevant to the batch and date
          // Adding sessions to finalSessions

          for (session in sessions) {
            for (group in groups) {
              if (sessions[session].Ses_group == groups[group].id) {
                finalSessions.push(sessions[session]);
              }
            }
          } // Loading module details of related modules of student groups


          modules = [];

          for (group in groups) {
            modules.push(groups[group].Module);
          }

          _context2.prev = 44;
          _context2.next = 47;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, modules));

        case 47:
          modules = _context2.sent;
          console.log('modules of relvant groups');
          console.log(modules);
          _context2.next = 57;
          break;

        case 52:
          _context2.prev = 52;
          _context2.t2 = _context2["catch"](44);
          console.log(_context2.t2);
          res.send({
            status: '500',
            sessions: [],
            groups: []
          });
          return _context2.abrupt("return");

        case 57:
          for (group in groups) {
            for (module in modules) {
              if (groups[group].Module == modules[module].id) {
                groups[group].Module = modules[module].Code + '<br>' + modules[module].Name;
              }
            }
          }

          res.send({
            status: '200',
            sessions: finalSessions,
            groups: groups
          });

        case 59:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 14], [24, 32], [44, 52]]);
}; // LOAD EMPLOYEES (LECTURERS) WHO ARE ASSIGNED TO SPECIFIC GROUP


exports.today_loadEmployeesOfGroup = function _callee3(req, res) {
  var group_id, employees, emp_ids;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          group_id = req.query.group_id;
          employees = [];
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getEmployeesOfAGroup(conn, group_id));

        case 5:
          employees = _context3.sent;
          console.log('employees of group');
          console.log(employees);
          _context3.next = 15;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](2);
          console.log(_context3.t0);
          res.send({
            status: '500',
            employees: []
          });
          return _context3.abrupt("return");

        case 15:
          emp_ids = [];

          for (emp in employees) {
            emp_ids.push(employees[emp].Employee);
          }

          _context3.prev = 17;
          _context3.next = 20;
          return regeneratorRuntime.awrap(commonFunctions.getEmployeeDetails(conn, emp_ids, ['id', 'Name']));

        case 20:
          employees = _context3.sent;
          console.log('employee details');
          console.log(employees);
          _context3.next = 30;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t1 = _context3["catch"](17);
          console.log(_context3.t1);
          res.send({
            status: '500',
            employees: []
          });
          return _context3.abrupt("return");

        case 30:
          res.send({
            status: '200',
            employees: employees
          });

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 10], [17, 25]]);
}; // ADD SESSION USING TIMETABLE ID AND EMPLOYEE ID


exports.today_addSession = function _callee4(req, res) {
  var timeTableID, employeeID, group, timeTableRow, date, dateString, Session, keys, values, result, result2, modules;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          timeTableID = req.body.timeTableID;
          employeeID = req.body.employeeID;
          group = [];
          group.push(req.body.group);
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getTimeTableUsingID(conn, timeTableID));

        case 7:
          timeTableRow = _context4.sent;
          console.log('timeTableRow');
          console.log(timeTableRow);
          _context4.next = 17;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](4);
          console.log(_context4.t0);
          res.send({
            status: '500',
            error: _context4.t0
          });
          return _context4.abrupt("return");

        case 17:
          //let date = new Date().getDate().toLocaleString("en-UK", {timeZone: 'Asia/Kolkata'});
          //let d = date.getDate();
          date = new Date();
          dateString = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, "0") + '-' + date.getDate().toString().padStart(2, "0");
          timeTableRow[0].Start_time = dateString + ' ' + timeTableRow[0].Start_time;
          Session = {
            Ses_group: timeTableRow[0].T_group,
            Start_time: '"' + timeTableRow[0].Start_time + '"',
            Duration: timeTableRow[0].Duration,
            Method: timeTableRow[0].Method,
            Type: timeTableRow[0].Type,
            Lecturer: employeeID
          };
          keys = Object.keys(Session);
          values = Object.values(Session);
          console.log(keys);
          console.log(values);
          console.log(dateString);
          _context4.prev = 26;
          _context4.next = 29;
          return regeneratorRuntime.awrap(commonFunctions.addNewSession(conn, keys, values));

        case 29:
          result = _context4.sent;
          console.log(result);
          result = result.insertId;
          _context4.next = 39;
          break;

        case 34:
          _context4.prev = 34;
          _context4.t1 = _context4["catch"](26);
          console.log(_context4.t1);
          res.send({
            status: '500',
            error: _context4.t1
          });
          return _context4.abrupt("return");

        case 39:
          _context4.prev = 39;
          _context4.next = 42;
          return regeneratorRuntime.awrap(commonFunctions.addNewSessionToAttendance(conn, group[0], result));

        case 42:
          result2 = _context4.sent;
          console.log(result2);
          _context4.next = 66;
          break;

        case 46:
          _context4.prev = 46;
          _context4.t2 = _context4["catch"](39);
          console.log('yes 1');
          _context4.prev = 49;
          console.log('yes 2');
          _context4.next = 53;
          return regeneratorRuntime.awrap(commonFunctions.deleteSession(conn, result));

        case 53:
          result2 = _context4.sent;
          _context4.next = 62;
          break;

        case 56:
          _context4.prev = 56;
          _context4.t3 = _context4["catch"](49);
          console.log('yes 4');
          console.log(_context4.t3);
          res.send({
            status: '501',
            error: _context4.t3
          });
          return _context4.abrupt("return");

        case 62:
          console.log('yes 3');
          console.log(_context4.t2);
          res.send({
            status: '500',
            error: _context4.t2
          });
          return _context4.abrupt("return");

        case 66:
          console.log('yes 5');
          _context4.prev = 67;
          _context4.next = 70;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, group, null, 1));

        case 70:
          group = _context4.sent;
          console.log('group');
          console.log(group);
          _context4.next = 80;
          break;

        case 75:
          _context4.prev = 75;
          _context4.t4 = _context4["catch"](67);
          console.log(_context4.t4);
          res.send({
            status: '201',
            session: result
          });
          return _context4.abrupt("return");

        case 80:
          modules = [];
          modules.push(group[0].Module);
          _context4.prev = 82;
          _context4.next = 85;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, modules));

        case 85:
          modules = _context4.sent;
          console.log('module');
          console.log(modules);
          _context4.next = 95;
          break;

        case 90:
          _context4.prev = 90;
          _context4.t5 = _context4["catch"](82);
          console.log(_context4.t5);
          res.send({
            status: '201',
            session: result
          });
          return _context4.abrupt("return");

        case 95:
          res.send({
            status: '200',
            session: result,
            Start_time: values[1],
            module: modules
          });

        case 96:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 12], [26, 34], [39, 46], [49, 56], [67, 75], [82, 90]]);
};

exports.sem_view = function _callee5(req, res) {
  var employee_details, batches, modules;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('Starting controller...');
          batches = [], modules = [];
          _context5.next = 4;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 4:
          employee_details = _context5.sent;
          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 8:
          batches = _context5.sent;
          console.log(batches);
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](5);
          console.log('Error : ' + _context5.t0); // Set error page

        case 15:
          _context5.prev = 15;
          _context5.next = 18;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 18:
          modules = _context5.sent;
          console.log(modules);
          _context5.next = 25;
          break;

        case 22:
          _context5.prev = 22;
          _context5.t1 = _context5["catch"](15);
          console.log('Error : ' + _context5.t1); // Set error page

        case 25:
          // RENDERING THE VIEW
          res.render('nonacademic_semester', {
            employee: employee_details,
            batches: batches,
            modules: modules
          });

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 12], [15, 22]]);
}; // ADD A STUDENT GROUP


exports.add_group_view = function _callee6(req, res) {
  var employee_details, batches, modules;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          batches = [], modules = [];
          _context6.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context6.sent;
          _context6.prev = 4;
          _context6.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context6.sent;
          console.log(batches);
          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](4);
          console.log('Error : ' + _context6.t0); // Set error page

        case 14:
          _context6.prev = 14;
          _context6.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 17:
          modules = _context6.sent;
          console.log(modules);
          _context6.next = 24;
          break;

        case 21:
          _context6.prev = 21;
          _context6.t1 = _context6["catch"](14);
          console.log('Error : ' + _context6.t1); // Set error page

        case 24:
          _context6.prev = 24;
          _context6.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 27:
          degrees = _context6.sent;
          console.log(degrees);
          _context6.next = 34;
          break;

        case 31:
          _context6.prev = 31;
          _context6.t2 = _context6["catch"](24);
          console.log('Error : ' + _context6.t2); // Set error page

        case 34:
          res.render('nonacademic_add_group', {
            employee: employee_details,
            batches: batches,
            modules: modules,
            degrees: degrees
          });

        case 35:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21], [24, 31]]);
}; // VERIFY ADDING STUDENT GROUP


exports.add_group_verifygroup = function _callee7(req, res) {
  var batch, module, degrees, group_name, filter_type, checkGroupName, getStudents, result, students;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          batch = req.query.batch;
          module = req.query.module;
          degrees = req.query.degrees;
          group_name = req.query.group_name;
          filter_type = req.query.filter_type;
          console.log(batch, module, degrees, group_name, filter_type);

          checkGroupName = function checkGroupName(group_name) {
            return new Promise(function (resolve, reject) {
              var query = 'SELECT * FROM student_groups WHERE Name = ?';
              conn.query(query, group_name, function (err, result) {
                if (err) reject(err);else resolve(result);
              });
            });
          };

          getStudents = function getStudents(batch, degrees) {
            return new Promise(function (resolve, reject) {
              var query = 'SELECT * FROM students WHERE Batch = ? AND Degree IN (?) ORDER BY IndexNo';
              conn.query(query, [batch, degrees], function (err, result) {
                console.log(query);
                if (err) reject(err);else resolve(result);
              });
            });
          };

          _context7.prev = 8;
          _context7.next = 11;
          return regeneratorRuntime.awrap(checkGroupName(group_name));

        case 11:
          result = _context7.sent;
          _context7.next = 19;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](8);
          console.log(_context7.t0);
          res.send({
            status: '500',
            error: _context7.t0
          });
          return _context7.abrupt("return");

        case 19:
          if (!(result.length > 0)) {
            _context7.next = 22;
            break;
          }

          res.send({
            status: '201'
          });
          return _context7.abrupt("return");

        case 22:
          students = [];

          if (!(filter_type == 1)) {
            _context7.next = 27;
            break;
          }

          res.send({
            status: '200',
            students: students
          });
          _context7.next = 38;
          break;

        case 27:
          _context7.prev = 27;
          _context7.next = 30;
          return regeneratorRuntime.awrap(getStudents(batch, degrees));

        case 30:
          students = _context7.sent;
          _context7.next = 38;
          break;

        case 33:
          _context7.prev = 33;
          _context7.t1 = _context7["catch"](27);
          console.log(_context7.t1);
          res.send({
            status: '500',
            error: _context7.t1
          });
          return _context7.abrupt("return");

        case 38:
          res.send({
            status: '200',
            students: students
          });

        case 39:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[8, 14], [27, 33]]);
};

exports.stu_view = function _callee8(req, res) {
  var employee_details, faculties, batches, degrees, students;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log('Starting controller...');
          faculties = [], batches = [], degrees = [], students = [];
          _context8.next = 4;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 4:
          employee_details = _context8.sent;
          _context8.prev = 5;
          _context8.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getFaculties(conn, null));

        case 8:
          faculties = _context8.sent;
          console.log(faculties);
          _context8.next = 15;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](5);
          console.log('Error : ' + _context8.t0);

        case 15:
          _context8.prev = 15;
          _context8.next = 18;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 18:
          batches = _context8.sent;
          console.log(batches);
          _context8.next = 25;
          break;

        case 22:
          _context8.prev = 22;
          _context8.t1 = _context8["catch"](15);
          console.log('Error : ' + _context8.t1);

        case 25:
          _context8.prev = 25;
          _context8.next = 28;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 28:
          degrees = _context8.sent;
          console.log(degrees);
          _context8.next = 35;
          break;

        case 32:
          _context8.prev = 32;
          _context8.t2 = _context8["catch"](25);
          console.log('Error : ' + _context8.t2);

        case 35:
          console.log('finishing...'); // RENDERING THE VIEW

          res.render('nonacademic_students', {
            employee: employee_details,
            faculties: faculties,
            batches: batches,
            degrees: degrees,
            students: students
          });

        case 37:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[5, 12], [15, 22], [25, 32]]);
}; // RETRIEVE STUDENTS FILTERED BY FACULTY, BATCH AND DEGREE


exports.stu_get_filtered = function _callee9(req, res) {
  var fac, batch, deg, students, sql;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
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
          _context9.prev = 8;
          _context9.next = 11;
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
          students = _context9.sent;
          res.send({
            status: '200',
            students: students
          });
          _context9.next = 19;
          break;

        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](8);
          console.log(_context9.t0);
          res.send({
            status: '500',
            students: students
          });

        case 19:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[8, 15]]);
};

exports.stu_get_profile = function _callee10(req, res) {
  var search_index, search_keyword, employee_details, student, groups, modules, sessions, attendances, sql, degree, deg, bat, batch, id_list, _row, attendanceLoop, present, session_count, percentage, _row2, key;

  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log('Function starting... stu profile');
          search_index = req.query.searchoption;
          search_keyword = req.query.keyword;
          _context11.next = 5;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 5:
          employee_details = _context11.sent;
          sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch,Telephone,Address FROM students';

          if (search_index == 0) {
            sql += ' WHERE IndexNo = "' + search_keyword + '"';
          } else if (search_index == 1) {
            sql += ' WHERE Name = "' + search_keyword + '"';
          } else if (search_index == 2) {
            sql += ' WHERE Email = "' + search_keyword + '"';
          }

          _context11.prev = 8;
          _context11.next = 11;
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
          student = _context11.sent;
          _context11.next = 18;
          break;

        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](8);
          console.log(_context11.t0);
          res.send({
            status: '500',
            student: student
          });

        case 18:
          if (!(student.length == 0)) {
            _context11.next = 23;
            break;
          }

          res.status(201).send({
            res: 'No such students'
          });
          return _context11.abrupt("return");

        case 23:
          //RETRIEVING DEGREE OF THE STUDENT
          degree = [student[0].Degree];
          _context11.prev = 24;
          _context11.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, degree));

        case 27:
          deg = _context11.sent;
          student[0].Degree = deg[0].Degree;
          _context11.next = 34;
          break;

        case 31:
          _context11.prev = 31;
          _context11.t1 = _context11["catch"](24);
          console.log('Error : ' + _context11.t1);

        case 34:
          //RETRIEVING Batch OF THE STUDENT
          batch = [student[0].Batch];
          _context11.prev = 35;
          _context11.next = 38;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, batch));

        case 38:
          bat = _context11.sent;
          student[0].Batch = bat[0].Batch;
          _context11.next = 45;
          break;

        case 42:
          _context11.prev = 42;
          _context11.t2 = _context11["catch"](35);
          console.log('Error : ' + _context11.t2);

        case 45:
          _context11.prev = 45;
          _context11.next = 48;
          return regeneratorRuntime.awrap(commonFunctions.getGroupsOfAStudent(conn, student[0].id));

        case 48:
          groups = _context11.sent;
          console.log("Student Groups");
          console.log(groups);
          _context11.next = 56;
          break;

        case 53:
          _context11.prev = 53;
          _context11.t3 = _context11["catch"](45);
          console.log('Error : ' + _context11.t3);

        case 56:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Stu_group);
          }); // RETRIEVING ALL GROUPS RELEVANT TO THE STUDENT

          _context11.prev = 58;
          _context11.next = 61;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, id_list, null, 1));

        case 61:
          groups = _context11.sent;
          console.log(groups);
          _context11.next = 68;
          break;

        case 65:
          _context11.prev = 65;
          _context11.t4 = _context11["catch"](58);
          console.log('Error : ' + _context11.t4);

        case 68:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Module);
          }); // RETRIEVING ALL MODULES RELEVANT TO THE STUDENT

          _context11.prev = 70;
          _context11.next = 73;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, id_list));

        case 73:
          modules = _context11.sent;
          console.log(modules);
          _context11.next = 80;
          break;

        case 77:
          _context11.prev = 77;
          _context11.t5 = _context11["catch"](70);
          console.log('Error : ' + _context11.t5);

        case 80:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.id);
          }); // RETRIEVING ALL SESSIONS RELEVANT TO THE GROUPS

          _context11.prev = 82;
          _context11.next = 85;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, id_list, 1));

        case 85:
          sessions = _context11.sent;
          console.log(sessions);
          _context11.next = 92;
          break;

        case 89:
          _context11.prev = 89;
          _context11.t6 = _context11["catch"](82);
          console.log('Error : ' + _context11.t6);

        case 92:
          //RETIEVING ALL ATTENDANCE ROWS OF SELECTED STUDENT RELEVANT TO EACH STUDENT GROUP
          attendances = [];
          _row = [];

          attendanceLoop = function attendanceLoop(_) {
            return regeneratorRuntime.async(function attendanceLoop$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.t0 = regeneratorRuntime.keys(groups);

                  case 1:
                    if ((_context10.t1 = _context10.t0()).done) {
                      _context10.next = 16;
                      break;
                    }

                    grp = _context10.t1.value;
                    _context10.prev = 3;
                    _context10.next = 6;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, groups[grp].id));

                  case 6:
                    _row = _context10.sent;

                    _row.push({
                      group: groups[grp].id
                    }); //console.log(row);


                    attendances.push(_row);
                    _context10.next = 14;
                    break;

                  case 11:
                    _context10.prev = 11;
                    _context10.t2 = _context10["catch"](3);
                    console.log('Error : ' + _context10.t2);

                  case 14:
                    _context10.next = 1;
                    break;

                  case 16:
                  case "end":
                    return _context10.stop();
                }
              }
            }, null, null, [[3, 11]]);
          };

          _context11.next = 97;
          return regeneratorRuntime.awrap(attendanceLoop());

        case 97:
          for (_row2 in attendances) {
            present = 0;
            session_count = 0;

            for (key in attendances[_row2][0]) {
              if (key != 'id' && key != 'Student') {
                session_count++;

                if (checkValidTimeStamp(attendances[_row2][0][key])) {
                  present++;
                }
              }
            }

            session_count == 0 ? percentage = 100 : percentage = present / session_count * 100;

            attendances[_row2].push({
              percentage: percentage,
              session_count: session_count
            }); //console.log(percentage + '%');

          } //console.log(attendances);


          console.log(attendances);
          console.log(student);
          res.render('nonacademic_student_profile', {
            employee: employee_details,
            student: student,
            modules: modules,
            groups: groups,
            attendance: attendances,
            sessions: sessions
          });

        case 101:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[8, 14], [24, 31], [35, 42], [45, 53], [58, 65], [70, 77], [82, 89]]);
}; // RETRIEVE VIEW RELATED TO PAST REPORTS SECTION


exports.past_reports_view = function _callee11(req, res) {
  var employee_details, groups, modules, batches, degrees;
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          console.log('Function starting... get_past_reports');
          _context12.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context12.sent;
          _context12.prev = 4;
          _context12.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context12.sent;
          console.log(batches);
          _context12.next = 14;
          break;

        case 11:
          _context12.prev = 11;
          _context12.t0 = _context12["catch"](4);
          console.log('Error : ' + _context12.t0);

        case 14:
          _context12.prev = 14;
          _context12.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 17:
          modules = _context12.sent;
          console.log(modules);
          _context12.next = 24;
          break;

        case 21:
          _context12.prev = 21;
          _context12.t1 = _context12["catch"](14);
          console.log('Error : ' + _context12.t1);

        case 24:
          _context12.prev = 24;
          _context12.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 27:
          degrees = _context12.sent;
          console.log(degrees);
          _context12.next = 34;
          break;

        case 31:
          _context12.prev = 31;
          _context12.t2 = _context12["catch"](24);
          console.log('Error : ' + _context12.t2);

        case 34:
          res.render('nonacademic_past_reports', {
            employee: employee_details,
            batches: batches,
            modules: modules,
            groups: groups,
            degrees: degrees
          });

        case 35:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21], [24, 31]]);
}; // RETRIEVE GROUPS RELATED TO THE MODULE SELECTED BY THE USER


exports.past_get_groups = function _callee12(req, res) {
  var module, batch, modules, groups, matchingGroups;
  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          module = req.query.module;
          batch = req.query.batch;
          console.log(module);
          modules = [module];
          groups = [];
          _context13.prev = 5;
          _context13.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, modules, null, 2));

        case 8:
          groups = _context13.sent;
          console.log(groups);
          _context13.next = 16;
          break;

        case 12:
          _context13.prev = 12;
          _context13.t0 = _context13["catch"](5);
          console.log('Error : ' + _context13.t0);
          res.send({
            status: '500',
            groups: groups
          });

        case 16:
          matchingGroups = [];

          for (group in groups) {
            if (groups[group].Batch == batch) {
              matchingGroups.push(groups[group]);
            }
          }

          console.log(groups);
          res.send({
            status: '200',
            groups: matchingGroups
          });

        case 20:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[5, 12]]);
}; // RETRIEVE SESSIONS ACCORDING TO THE GIVEN BATCH, MODULE AND GROUP


exports.past_get_sessions = function _callee13(req, res) {
  var group, groups, sessions, lecturers, lec_id, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _session2;

  return regeneratorRuntime.async(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          group = req.query.group;
          groups = [group];
          _context14.prev = 2;
          _context14.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, groups, 1));

        case 5:
          sessions = _context14.sent;
          console.log(sessions);
          _context14.next = 13;
          break;

        case 9:
          _context14.prev = 9;
          _context14.t0 = _context14["catch"](2);
          console.log('Error : ' + _context14.t0);
          res.send({
            status: '500',
            sessions: sessions
          });

        case 13:
          if (!(sessions.length == 0)) {
            _context14.next = 16;
            break;
          }

          res.send({
            status: '200',
            sessions: sessions
          });
          return _context14.abrupt("return");

        case 16:
          lec_id = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context14.prev = 20;

          for (_iterator = sessions[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _session2 = _step.value;
            lec_id.push(_session2.Lecturer);
          }

          _context14.next = 28;
          break;

        case 24:
          _context14.prev = 24;
          _context14.t1 = _context14["catch"](20);
          _didIteratorError = true;
          _iteratorError = _context14.t1;

        case 28:
          _context14.prev = 28;
          _context14.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context14.prev = 31;

          if (!_didIteratorError) {
            _context14.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context14.finish(31);

        case 35:
          return _context14.finish(28);

        case 36:
          lec_id = _toConsumableArray(new Set(lec_id));
          _context14.prev = 37;
          _context14.next = 40;
          return regeneratorRuntime.awrap(commonFunctions.getEmployeeDetails(conn, lec_id, ['id', 'Name']));

        case 40:
          lecturers = _context14.sent;
          _context14.next = 47;
          break;

        case 43:
          _context14.prev = 43;
          _context14.t2 = _context14["catch"](37);
          console.log('Error : ' + _context14.t2);
          res.send({
            status: '500',
            sessions: sessions,
            lecturers: lecturers
          });

        case 47:
          res.send({
            status: '200',
            sessions: sessions,
            lecturers: lecturers
          });

        case 48:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[2, 9], [20, 24, 28, 36], [29,, 31, 35], [37, 43]]);
};

exports.past_get_sessionattendance = function _callee14(req, res) {
  var session, group, attendance, students;
  return regeneratorRuntime.async(function _callee14$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          session = [];
          session.push(req.query.session);
          attendance = [];

          if (!(req.query.group == 'null')) {
            _context15.next = 20;
            break;
          }

          _context15.prev = 4;
          _context15.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, session, 2));

        case 7:
          session = _context15.sent;
          console.log(session);
          _context15.next = 16;
          break;

        case 11:
          _context15.prev = 11;
          _context15.t0 = _context15["catch"](4);
          console.log('Error : ' + _context15.t0);
          res.send({
            status: '500',
            attendance: []
          });
          return _context15.abrupt("return");

        case 16:
          group = session[0].Ses_group;
          session = session[0].id;
          _context15.next = 22;
          break;

        case 20:
          group = req.query.group;
          session = req.query.session;

        case 22:
          _context15.prev = 22;
          _context15.next = 25;
          return regeneratorRuntime.awrap(commonFunctions.getAttendanceofSession(conn, session, group));

        case 25:
          attendance = _context15.sent;
          console.log(attendance);
          _context15.next = 34;
          break;

        case 29:
          _context15.prev = 29;
          _context15.t1 = _context15["catch"](22);
          console.log('Error : ' + _context15.t1);
          res.send({
            status: '500',
            attendance: []
          });
          return _context15.abrupt("return");

        case 34:
          if (!(attendance.length == 0)) {
            _context15.next = 37;
            break;
          }

          res.send({
            status: '200',
            attendance: []
          });
          return _context15.abrupt("return");

        case 37:
          students = [];

          for (student in attendance) {
            students.push([attendance[student].Student]);
          }

          _context15.prev = 39;
          _context15.next = 42;
          return regeneratorRuntime.awrap(commonFunctions.getStudentsFiltered(conn, students, 0));

        case 42:
          students = _context15.sent;
          console.log(students);
          _context15.next = 51;
          break;

        case 46:
          _context15.prev = 46;
          _context15.t2 = _context15["catch"](39);
          console.log('Error : ' + _context15.t2);
          res.send({
            status: '500',
            attendance: []
          });
          return _context15.abrupt("return");

        case 51:
          for (row in attendance) {
            for (student in students) {
              if (students[student].id == attendance[row].Student) {
                attendance[row].Student = students[student].IndexNo;
                attendance[row].Degree = students[student].Degree;
                attendance[row].Name = students[student].Name;
              }
            }
          }

          res.send({
            status: '200',
            attendance: attendance
          });

        case 53:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[4, 11], [22, 29], [39, 46]]);
}; // GET PAGE OF GETTING ATTENDANCE OF A SPECIFIC MODULE AND BATCH


exports.past_moduleattendance_view = function _callee15(req, res) {
  var employee_details, modules, batches;
  return regeneratorRuntime.async(function _callee15$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          console.log('Function starting... get past module attendance');
          _context16.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context16.sent;
          _context16.prev = 4;
          _context16.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context16.sent;
          console.log(batches);
          _context16.next = 14;
          break;

        case 11:
          _context16.prev = 11;
          _context16.t0 = _context16["catch"](4);
          console.log('Error : ' + _context16.t0);

        case 14:
          _context16.prev = 14;
          _context16.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 17:
          modules = _context16.sent;
          console.log(modules);
          _context16.next = 24;
          break;

        case 21:
          _context16.prev = 21;
          _context16.t1 = _context16["catch"](14);
          console.log('Error : ' + _context16.t1);

        case 24:
          res.render('nonacademic_moduleattendance', {
            employee: employee_details,
            batches: batches,
            modules: modules
          });

        case 25:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET ATTENDANCE OF SPECIFIC MODULE AND BATCH


exports.past_moduleattendance = function _callee16(req, res) {
  var module, batch, matchingGroups, getAttendance, attendance_of_groups, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _group, current_group_attendance, present, session_count, percentage, finalAttendance, studentAttendance, _i, _attendance_of_groups, _group2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _student, key;

  return regeneratorRuntime.async(function _callee16$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          module = req.query.module;
          batch = req.query.batch;
          _context18.prev = 2;
          _context18.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, [module], [batch], 2));

        case 5:
          matchingGroups = _context18.sent;
          console.log(matchingGroups);
          _context18.next = 13;
          break;

        case 9:
          _context18.prev = 9;
          _context18.t0 = _context18["catch"](2);
          res.send({
            status: '500'
          });
          return _context18.abrupt("return");

        case 13:
          getAttendance = function getAttendance(group) {
            return regeneratorRuntime.async(function getAttendance$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    return _context17.abrupt("return", new Promise(function (resolve, reject) {
                      var sql = 'SELECT a.*, s.IndexNo, s.Name, s.Degree FROM attendance_' + group + ' a INNER JOIN students s ON a.Student = s.id';
                      conn.query(sql, function (err, result) {
                        if (err) {
                          console.log('Error : ' + err);
                          reject(err);
                        } else {
                          resolve(result);
                        }
                      });
                    }));

                  case 1:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          };

          attendance_of_groups = [];
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context18.prev = 18;
          _iterator2 = matchingGroups[Symbol.iterator]();

        case 20:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context18.next = 38;
            break;
          }

          _group = _step2.value;
          current_group_attendance = [];
          _context18.prev = 23;
          _context18.next = 26;
          return regeneratorRuntime.awrap(getAttendance(_group.id));

        case 26:
          current_group_attendance = _context18.sent;
          attendance_of_groups.push(current_group_attendance);
          _context18.next = 35;
          break;

        case 30:
          _context18.prev = 30;
          _context18.t1 = _context18["catch"](23);
          console.log('Error : ' + _context18.t1);
          res.send({
            status: '500'
          });
          return _context18.abrupt("return");

        case 35:
          _iteratorNormalCompletion2 = true;
          _context18.next = 20;
          break;

        case 38:
          _context18.next = 44;
          break;

        case 40:
          _context18.prev = 40;
          _context18.t2 = _context18["catch"](18);
          _didIteratorError2 = true;
          _iteratorError2 = _context18.t2;

        case 44:
          _context18.prev = 44;
          _context18.prev = 45;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 47:
          _context18.prev = 47;

          if (!_didIteratorError2) {
            _context18.next = 50;
            break;
          }

          throw _iteratorError2;

        case 50:
          return _context18.finish(47);

        case 51:
          return _context18.finish(44);

        case 52:
          finalAttendance = [];
          studentAttendance = [];
          _i = 0, _attendance_of_groups = attendance_of_groups;

        case 55:
          if (!(_i < _attendance_of_groups.length)) {
            _context18.next = 82;
            break;
          }

          _group2 = _attendance_of_groups[_i];
          present = 0;
          session_count = 0;

          if (!(_group2.length > 0)) {
            _context18.next = 79;
            break;
          }

          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context18.prev = 63;

          for (_iterator3 = _group2[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            _student = _step3.value;
            studentAttendance = [];
            present = 0;
            session_count = 0;

            for (key in _student) {
              if (key != 'id' && key != 'Student' && key != 'IndexNo' && key != 'Name' && key != 'Degree') {
                session_count++;

                if (_student[key] != 0) {
                  present++;
                }
              }
            }

            session_count == 0 ? percentage = 100 : percentage = present / session_count * 100;
            studentAttendance = {
              index: _student.IndexNo,
              name: _student.Name,
              degree: _student.Degree,
              percentage: percentage
            };
            finalAttendance.push(studentAttendance);
          }

          _context18.next = 71;
          break;

        case 67:
          _context18.prev = 67;
          _context18.t3 = _context18["catch"](63);
          _didIteratorError3 = true;
          _iteratorError3 = _context18.t3;

        case 71:
          _context18.prev = 71;
          _context18.prev = 72;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 74:
          _context18.prev = 74;

          if (!_didIteratorError3) {
            _context18.next = 77;
            break;
          }

          throw _iteratorError3;

        case 77:
          return _context18.finish(74);

        case 78:
          return _context18.finish(71);

        case 79:
          _i++;
          _context18.next = 55;
          break;

        case 82:
          res.send({
            status: '200',
            attendance: finalAttendance
          });

        case 83:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[2, 9], [18, 40, 44, 52], [23, 30], [45,, 47, 51], [63, 67, 71, 79], [72,, 74, 78]]);
}; // GET PAGE FOR THE ATTENDANCE REPORT OF A SPECIFIC BATCH AND A DEGREE


exports.past_degreeattendance_view = function _callee17(req, res) {
  var employee_details, degrees, batches;
  return regeneratorRuntime.async(function _callee17$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          console.log('Function starting... get past degree attendance');
          _context19.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context19.sent;
          _context19.prev = 4;
          _context19.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context19.sent;
          console.log(batches);
          _context19.next = 14;
          break;

        case 11:
          _context19.prev = 11;
          _context19.t0 = _context19["catch"](4);
          console.log('Error : ' + _context19.t0);

        case 14:
          _context19.prev = 14;
          _context19.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 17:
          degrees = _context19.sent;
          console.log(degrees);
          _context19.next = 24;
          break;

        case 21:
          _context19.prev = 21;
          _context19.t1 = _context19["catch"](14);
          console.log('Error : ' + _context19.t1);

        case 24:
          res.render('nonacademic_degreeattendance', {
            employee: employee_details,
            batches: batches,
            degrees: degrees
          });

        case 25:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET ATTENDANCE REPORT OF A SPECIFIC BATCH AND A DEGREE


exports.past_degreeattendance = function _callee18(req, res) {
  var degree, batch, matchingGroups, getGroups;
  return regeneratorRuntime.async(function _callee18$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          degree = req.query.degree;
          batch = req.query.batch;

          getGroups = function getGroups(degree, batch) {
            return new Promise(function (resolve, reject) {
              var sql = 'SELECT g.id,g.Module FROM student_groups INNER JOIN degree_of_groups d ON d.Stu_group = g.id where d.Degree = ' + degree + ' AND d.Batch = ' + batch;
              conn.query(sql, [degree, batch], function (err, result) {
                if (err) {
                  console.log('Error : ' + err);
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });
          };

          _context20.prev = 3;
          _context20.next = 6;
          return regeneratorRuntime.awrap(getGroups(degree, batch));

        case 6:
          matchingGroups = _context20.sent;
          console.log(matchingGroups);
          _context20.next = 14;
          break;

        case 10:
          _context20.prev = 10;
          _context20.t0 = _context20["catch"](3);
          console.log('Error : ' + _context20.t0);
          res.send({
            status: '500'
          });

        case 14:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[3, 10]]);
}; // GET REQUIRED DETAILS TO LOAD TIME TABLE SCREEN


exports.timetable_view = function _callee19(req, res) {
  var employee_details, degrees, batches;
  return regeneratorRuntime.async(function _callee19$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          console.log('Function starting... get time table');
          _context21.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context21.sent;
          _context21.prev = 4;
          _context21.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context21.sent;
          console.log(batches);
          _context21.next = 14;
          break;

        case 11:
          _context21.prev = 11;
          _context21.t0 = _context21["catch"](4);
          console.log('Error : ' + _context21.t0);

        case 14:
          _context21.prev = 14;
          _context21.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 17:
          degrees = _context21.sent;
          console.log(degrees);
          _context21.next = 24;
          break;

        case 21:
          _context21.prev = 21;
          _context21.t1 = _context21["catch"](14);
          console.log('Error : ' + _context21.t1);

        case 24:
          res.render('nonacademic_timetable', {
            employee: employee_details,
            batches: batches,
            degrees: degrees
          });

        case 25:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET LECTURES RELEVANT TO GIVEN DAY, BATCH AND DEGREE


exports.timetable_getlectures = function _callee20(req, res) {
  var day, batch, degree, groups, group_ids, modules, lectures;
  return regeneratorRuntime.async(function _callee20$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          day = req.query.day;
          batch = [];
          batch.push(req.query.batch);
          degree = req.query.degree;
          console.log(day);
          groups = [];
          _context22.prev = 6;
          _context22.next = 9;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, batch, null, 3));

        case 9:
          groups = _context22.sent;
          console.log('groups of the batch');
          console.log(groups);
          _context22.next = 19;
          break;

        case 14:
          _context22.prev = 14;
          _context22.t0 = _context22["catch"](6);
          console.log('Error : ' + _context22.t0);
          res.send({
            status: '500',
            lectures: []
          });
          return _context22.abrupt("return");

        case 19:
          if (!(groups.length == 0)) {
            _context22.next = 22;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context22.abrupt("return");

        case 22:
          group_ids = [], modules = [];

          for (group in groups) {
            group_ids.push(groups[group].id);
          }

          _context22.prev = 24;
          _context22.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getGroups_DegreeFiltered(conn, degree, group_ids));

        case 27:
          groups = _context22.sent;
          console.log('groups of the batch and degree');
          console.log(groups);
          _context22.next = 37;
          break;

        case 32:
          _context22.prev = 32;
          _context22.t1 = _context22["catch"](24);
          console.log('Error : ' + _context22.t1);
          res.send({
            status: '500',
            lectures: []
          });
          return _context22.abrupt("return");

        case 37:
          if (!(groups.length == 0)) {
            _context22.next = 40;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context22.abrupt("return");

        case 40:
          group_ids = [];

          for (group in groups) {
            group_ids.push(groups[group].Stu_group);
          }

          lectures = [];
          _context22.prev = 43;
          _context22.next = 46;
          return regeneratorRuntime.awrap(commonFunctions.getTimeTable(conn, day, group_ids));

        case 46:
          lectures = _context22.sent;
          console.log('time table of the batch, degree and day');
          console.log(lectures);
          _context22.next = 56;
          break;

        case 51:
          _context22.prev = 51;
          _context22.t2 = _context22["catch"](43);
          console.log('Error : ' + _context22.t2);
          res.send({
            status: '500',
            lectures: []
          });
          return _context22.abrupt("return");

        case 56:
          if (!(lectures.length == 0)) {
            _context22.next = 59;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context22.abrupt("return");

        case 59:
          group_ids = [];

          for (lecture in lectures) {
            group_ids.push(lectures[lecture].T_group);
          }

          _context22.prev = 61;
          _context22.next = 64;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, group_ids, null, 1));

        case 64:
          groups = _context22.sent;
          console.log('groups that have lectures on the day in selected batch and degree');
          console.log(groups);
          _context22.next = 74;
          break;

        case 69:
          _context22.prev = 69;
          _context22.t3 = _context22["catch"](61);
          console.log('Error : ' + _context22.t3);
          res.send({
            status: '500',
            lectures: []
          });
          return _context22.abrupt("return");

        case 74:
          if (!(groups.length == 0)) {
            _context22.next = 77;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context22.abrupt("return");

        case 77:
          for (group in groups) {
            modules.push(groups[group].Module);
          }

          _context22.prev = 78;
          _context22.next = 81;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, modules));

        case 81:
          modules = _context22.sent;
          console.log('modules of relvant groups');
          console.log(modules);
          _context22.next = 91;
          break;

        case 86:
          _context22.prev = 86;
          _context22.t4 = _context22["catch"](78);
          console.log('Error : ' + _context22.t4);
          res.send({
            status: '500',
            lectures: []
          });
          return _context22.abrupt("return");

        case 91:
          for (group in groups) {
            for (module in modules) {
              if (groups[group].Module == modules[module].id) {
                groups[group].Module = modules[module].Code + '<br>' + modules[module].Name;
              }
            }
          }

          res.send({
            status: '200',
            lectures: lectures,
            groups: groups
          });

        case 93:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[6, 14], [24, 32], [43, 51], [61, 69], [78, 86]]);
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
}

function load_attendance_of_a_student(groups) {
  var attendances, row;
  return regeneratorRuntime.async(function load_attendance_of_a_student$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          attendances = [];
          row = [];
          groups.forEach(function _callee21(element) {
            return regeneratorRuntime.async(function _callee21$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    _context23.prev = 0;
                    _context23.next = 3;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, element.id));

                  case 3:
                    row = _context23.sent;
                    row.push({
                      group: element.id
                    });
                    console.log(row);
                    attendances.push(row);
                    _context23.next = 12;
                    break;

                  case 9:
                    _context23.prev = 9;
                    _context23.t0 = _context23["catch"](0);
                    console.log('Error : ' + _context23.t0);

                  case 12:
                  case "end":
                    return _context23.stop();
                }
              }
            }, null, null, [[0, 9]]);
          });

        case 3:
        case "end":
          return _context24.stop();
      }
    }
  });
} // GET EMPLOYEE DETAILS, MATCHING DESIGNATIONS


function loadInitialDetails() {
  var employee_details, designations;
  return regeneratorRuntime.async(function loadInitialDetails$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          console.log(process.env.CURRENT_ID); // RETRIEVING ID AND THE DESIGNATION OF THE EMPLOYEE

          _context25.prev = 1;
          _context25.next = 4;
          return regeneratorRuntime.awrap(getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']));

        case 4:
          employee_details = _context25.sent;
          _context25.next = 10;
          break;

        case 7:
          _context25.prev = 7;
          _context25.t0 = _context25["catch"](1);
          console.log('Error : ' + _context25.t0);

        case 10:
          _context25.prev = 10;
          _context25.next = 13;
          return regeneratorRuntime.awrap(commonFunctions.getDesignations(conn));

        case 13:
          designations = _context25.sent;
          _context25.next = 19;
          break;

        case 16:
          _context25.prev = 16;
          _context25.t1 = _context25["catch"](10);
          console.log('Error : ' + _context25.t1);

        case 19:
          // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
          designations.forEach(function (element) {
            if (element.id == employee_details[0].Designation) {
              employee_details[0].Designation = element.Name;
              return;
            }
          });
          return _context25.abrupt("return", employee_details);

        case 21:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[1, 7], [10, 16]]);
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