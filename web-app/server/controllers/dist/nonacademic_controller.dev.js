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
          return regeneratorRuntime.awrap(commonFunctions.getEmployeeDetails(conn, emp_ids, ['id', 'Name'], 0));

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
  return regeneratorRuntime.async(function _callee7$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          batch = req.query.batch;
          module = req.query.module;
          degrees = req.query.degrees;
          group_name = req.query.group_name;
          filter_type = req.query.filter_type;
          console.log(batch, module, degrees, group_name, filter_type);

          checkGroupName = function checkGroupName(group_name) {
            return regeneratorRuntime.async(function checkGroupName$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    return _context7.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'SELECT * FROM student_groups WHERE Name = ?';
                      conn.query(query, group_name, function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          };

          getStudents = function getStudents(batch, degrees) {
            return regeneratorRuntime.async(function getStudents$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    return _context8.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'SELECT id,IndexNo,Name,Degree,Batch FROM students WHERE Batch = ? AND Degree IN (?) ORDER BY IndexNo';
                      conn.query(query, [batch, degrees], function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          };

          _context9.prev = 8;
          _context9.next = 11;
          return regeneratorRuntime.awrap(checkGroupName(group_name));

        case 11:
          result = _context9.sent;
          _context9.next = 19;
          break;

        case 14:
          _context9.prev = 14;
          _context9.t0 = _context9["catch"](8);
          console.log(_context9.t0);
          res.send({
            status: '500',
            error: _context9.t0
          });
          return _context9.abrupt("return");

        case 19:
          if (!(result.length > 0)) {
            _context9.next = 22;
            break;
          }

          res.send({
            status: '201'
          });
          return _context9.abrupt("return");

        case 22:
          students = [];

          if (!(filter_type == 1)) {
            _context9.next = 28;
            break;
          }

          res.send({
            status: '200',
            students: students
          });
          return _context9.abrupt("return");

        case 28:
          _context9.prev = 28;
          _context9.next = 31;
          return regeneratorRuntime.awrap(getStudents(batch, degrees));

        case 31:
          students = _context9.sent;
          _context9.next = 39;
          break;

        case 34:
          _context9.prev = 34;
          _context9.t1 = _context9["catch"](28);
          console.log(_context9.t1);
          res.send({
            status: '500',
            error: _context9.t1
          });
          return _context9.abrupt("return");

        case 39:
          res.send({
            status: '200',
            students: students
          });

        case 40:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[8, 14], [28, 34]]);
}; // GET STUDENT DETAILS TO ADD TO A GROUP


exports.add_group_getstudent = function _callee8(req, res) {
  var indexNo, batch, degrees, student, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, degree;

  return regeneratorRuntime.async(function _callee8$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          indexNo = req.query.index;
          batch = req.query.batch;
          degrees = req.query.degrees;
          _context10.prev = 3;
          _context10.next = 6;
          return regeneratorRuntime.awrap(commonFunctions.getStudentsFiltered(conn, [indexNo], 1));

        case 6:
          student = _context10.sent;
          console.log(student);
          _context10.next = 15;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](3);
          console.log(_context10.t0);
          res.send({
            status: '500',
            error: _context10.t0
          });
          return _context10.abrupt("return");

        case 15:
          if (!(student.length == 0)) {
            _context10.next = 20;
            break;
          }

          res.send({
            status: '201'
          });
          return _context10.abrupt("return");

        case 20:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context10.prev = 23;
          _iterator = degrees[Symbol.iterator]();

        case 25:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context10.next = 33;
            break;
          }

          degree = _step.value;

          if (!(student[0].Degree != Number(degree))) {
            _context10.next = 30;
            break;
          }

          res.send({
            status: '202'
          });
          return _context10.abrupt("return");

        case 30:
          _iteratorNormalCompletion = true;
          _context10.next = 25;
          break;

        case 33:
          _context10.next = 39;
          break;

        case 35:
          _context10.prev = 35;
          _context10.t1 = _context10["catch"](23);
          _didIteratorError = true;
          _iteratorError = _context10.t1;

        case 39:
          _context10.prev = 39;
          _context10.prev = 40;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 42:
          _context10.prev = 42;

          if (!_didIteratorError) {
            _context10.next = 45;
            break;
          }

          throw _iteratorError;

        case 45:
          return _context10.finish(42);

        case 46:
          return _context10.finish(39);

        case 47:
          if (!(student[0].Batch != batch)) {
            _context10.next = 52;
            break;
          }

          res.send({
            status: '202'
          });
          return _context10.abrupt("return");

        case 52:
          res.send({
            status: '200',
            students: student
          });
          return _context10.abrupt("return");

        case 54:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[3, 10], [23, 35, 39, 47], [40,, 42, 46]]);
}; // GET EMPLOYEE DETAILS TO ADD TO A GROUP


exports.add_group_getemployee = function _callee9(req, res) {
  var indexNo, employee;
  return regeneratorRuntime.async(function _callee9$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          indexNo = '"' + req.query.index + '"';
          employee = [];
          _context11.prev = 2;
          _context11.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getEmployeeDetails(conn, [indexNo], ['id,IndexNo,Name'], 1));

        case 5:
          employee = _context11.sent;
          _context11.next = 13;
          break;

        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](2);
          res.send({
            status: '500',
            error: _context11.t0
          });
          console.log(_context11.t0);
          return _context11.abrupt("return");

        case 13:
          if (!(employee.length == 0)) {
            _context11.next = 18;
            break;
          }

          res.send({
            status: '201'
          });
          return _context11.abrupt("return");

        case 18:
          res.send({
            status: '200',
            employees: employee
          });
          return _context11.abrupt("return");

        case 20:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[2, 8]]);
}; // SAVE GROUP DETAILS AFTER FINALIZING


exports.add_group_savegroup = function _callee10(req, res) {
  var group_name, batch, module, degrees, students, employees, addGroup, group_id, result, addDegrees_of_group, addStudents_of_group, addEmployees_of_group, addAttendanceTable;
  return regeneratorRuntime.async(function _callee10$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          group_name = req.body.group_name;
          batch = req.body.batch;
          module = req.body.module;
          degrees = req.body.degrees;
          students = req.body.students;
          employees = req.body.employees;

          addGroup = function addGroup(group_name, batch, module) {
            return regeneratorRuntime.async(function addGroup$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    return _context12.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'INSERT INTO student_groups(Name,Batch,Module) VALUES(?,?,?)';
                      conn.query(query, [group_name, batch, module], function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          };

          _context17.prev = 7;
          _context17.next = 10;
          return regeneratorRuntime.awrap(addGroup(group_name, batch, module));

        case 10:
          result = _context17.sent;
          group_id = result.insertId;
          _context17.next = 19;
          break;

        case 14:
          _context17.prev = 14;
          _context17.t0 = _context17["catch"](7);
          console.log(_context17.t0);
          res.send({
            status: '500',
            error: _context17.t0
          });
          return _context17.abrupt("return");

        case 19:
          addDegrees_of_group = function addDegrees_of_group(group_id, degrees) {
            return regeneratorRuntime.async(function addDegrees_of_group$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    return _context13.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'INSERT INTO degree_of_groups(Stu_group,Degree) VALUES ';
                      var _iteratorNormalCompletion2 = true;
                      var _didIteratorError2 = false;
                      var _iteratorError2 = undefined;

                      try {
                        for (var _iterator2 = degrees[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                          var degree = _step2.value;
                          query += '(' + group_id + ',' + Number(degree) + '),';
                        }
                      } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                            _iterator2["return"]();
                          }
                        } finally {
                          if (_didIteratorError2) {
                            throw _iteratorError2;
                          }
                        }
                      }

                      query = query.substring(0, query.length - 1);
                      conn.query(query, function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          };

          _context17.prev = 20;
          _context17.next = 23;
          return regeneratorRuntime.awrap(addDegrees_of_group(group_id, degrees));

        case 23:
          result = _context17.sent;
          _context17.next = 31;
          break;

        case 26:
          _context17.prev = 26;
          _context17.t1 = _context17["catch"](20);
          // Rollback code
          console.log(_context17.t1);
          res.send({
            status: '500',
            error: _context17.t1
          });
          return _context17.abrupt("return");

        case 31:
          if (!(result.affectedRows == 0)) {
            _context17.next = 34;
            break;
          }

          // Rollback code
          res.send({
            status: '500',
            error: e
          });
          return _context17.abrupt("return");

        case 34:
          addStudents_of_group = function addStudents_of_group(group_id, students) {
            return regeneratorRuntime.async(function addStudents_of_group$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    return _context14.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'INSERT INTO groups_for_students(Stu_group,Student) VALUES ';
                      var _iteratorNormalCompletion3 = true;
                      var _didIteratorError3 = false;
                      var _iteratorError3 = undefined;

                      try {
                        for (var _iterator3 = students[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                          var _student = _step3.value;
                          query += '(' + group_id + ',"' + _student + '"),';
                        }
                      } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                            _iterator3["return"]();
                          }
                        } finally {
                          if (_didIteratorError3) {
                            throw _iteratorError3;
                          }
                        }
                      }

                      query = query.substring(0, query.length - 1);
                      conn.query(query, function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          };

          _context17.prev = 35;
          _context17.next = 38;
          return regeneratorRuntime.awrap(addStudents_of_group(group_id, students));

        case 38:
          result = _context17.sent;
          _context17.next = 46;
          break;

        case 41:
          _context17.prev = 41;
          _context17.t2 = _context17["catch"](35);
          // Rollback code
          console.log(_context17.t2);
          res.send({
            status: '500',
            error: _context17.t2
          });
          return _context17.abrupt("return");

        case 46:
          if (!(result.affectedRows == 0)) {
            _context17.next = 49;
            break;
          }

          // Rollback code
          res.send({
            status: '500',
            error: e
          });
          return _context17.abrupt("return");

        case 49:
          addEmployees_of_group = function addEmployees_of_group(group_id, employees) {
            return regeneratorRuntime.async(function addEmployees_of_group$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    return _context15.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'INSERT INTO employees_of_groups(Emp_group,Employee) VALUES ';
                      var _iteratorNormalCompletion4 = true;
                      var _didIteratorError4 = false;
                      var _iteratorError4 = undefined;

                      try {
                        for (var _iterator4 = employees[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                          var employee = _step4.value;
                          query += '(' + group_id + ',"' + employee + '"),';
                        }
                      } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                            _iterator4["return"]();
                          }
                        } finally {
                          if (_didIteratorError4) {
                            throw _iteratorError4;
                          }
                        }
                      }

                      query = query.substring(0, query.length - 1);
                      conn.query(query, function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          };

          _context17.prev = 50;
          _context17.next = 53;
          return regeneratorRuntime.awrap(addEmployees_of_group(group_id, employees));

        case 53:
          result = _context17.sent;
          _context17.next = 61;
          break;

        case 56:
          _context17.prev = 56;
          _context17.t3 = _context17["catch"](50);
          // Rollback code
          console.log(_context17.t3);
          res.send({
            status: '500',
            error: _context17.t3
          });
          return _context17.abrupt("return");

        case 61:
          if (!(result.affectedRows == 0)) {
            _context17.next = 64;
            break;
          }

          // Rollback code
          res.send({
            status: '500',
            error: e
          });
          return _context17.abrupt("return");

        case 64:
          addAttendanceTable = function addAttendanceTable(group_id) {
            return regeneratorRuntime.async(function addAttendanceTable$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    return _context16.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'CREATE TABLE IF NOT EXISTS attendance_' + group_id + ' (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `Student` int NOT NULL)';
                      conn.query(query, function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          };

          _context17.prev = 65;
          _context17.next = 68;
          return regeneratorRuntime.awrap(addAttendanceTable(group_id));

        case 68:
          result = _context17.sent;
          _context17.next = 76;
          break;

        case 71:
          _context17.prev = 71;
          _context17.t4 = _context17["catch"](65);
          // Rollback code
          console.log(_context17.t4);
          res.send({
            status: '500',
            error: _context17.t4
          });
          return _context17.abrupt("return");

        case 76:
          res.send({
            status: '200'
          });

        case 77:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[7, 14], [20, 26], [35, 41], [50, 56], [65, 71]]);
}; // GET GROUPS OF SELECTED MODULE AND BATCH FOR TIMETABLE SETUP


exports.get_groups_timetable_setup = function _callee11(req, res) {
  var batch, module, groups;
  return regeneratorRuntime.async(function _callee11$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          batch = req.query.batch;
          module = req.query.module;
          _context18.prev = 2;
          _context18.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, [module], [batch], 5));

        case 5:
          groups = _context18.sent;
          _context18.next = 13;
          break;

        case 8:
          _context18.prev = 8;
          _context18.t0 = _context18["catch"](2);
          console.log(_context18.t0);
          res.send({
            status: '500',
            error: _context18.t0
          });
          return _context18.abrupt("return");

        case 13:
          if (!(groups.length == 0)) {
            _context18.next = 18;
            break;
          }

          res.send({
            status: '201'
          });
          return _context18.abrupt("return");

        case 18:
          res.send({
            status: '200',
            groups: groups
          });

        case 19:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[2, 8]]);
}; // SAVE SESSION FOR TIMETABLE SETUP


exports.save_session_timetable_setup = function _callee12(req, res) {
  var group, day, startTime, duration, type, method, repeat, sessions_in_timetable, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _session2, insertSession, result;

  return regeneratorRuntime.async(function _callee12$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          group = req.body.group;
          day = req.body.day;
          startTime = req.body.startTime;
          duration = req.body.duration;
          type = req.body.type;
          method = req.body.method;
          repeat = req.body.repeat;
          sessions_in_timetable = [];
          _context20.prev = 8;
          _context20.next = 11;
          return regeneratorRuntime.awrap(commonFunctions.getTimeTable(conn, day, [group]));

        case 11:
          sessions_in_timetable = _context20.sent;
          _context20.next = 19;
          break;

        case 14:
          _context20.prev = 14;
          _context20.t0 = _context20["catch"](8);
          console.log(_context20.t0);
          res.send({
            status: '500',
            error: _context20.t0
          });
          return _context20.abrupt("return");

        case 19:
          if (!(sessions_in_timetable.length > 0)) {
            _context20.next = 47;
            break;
          }

          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context20.prev = 23;
          _iterator5 = sessions_in_timetable[Symbol.iterator]();

        case 25:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context20.next = 33;
            break;
          }

          _session2 = _step5.value;

          if (!(_session2.Start_time == startTime)) {
            _context20.next = 30;
            break;
          }

          res.send({
            status: '201'
          });
          return _context20.abrupt("return");

        case 30:
          _iteratorNormalCompletion5 = true;
          _context20.next = 25;
          break;

        case 33:
          _context20.next = 39;
          break;

        case 35:
          _context20.prev = 35;
          _context20.t1 = _context20["catch"](23);
          _didIteratorError5 = true;
          _iteratorError5 = _context20.t1;

        case 39:
          _context20.prev = 39;
          _context20.prev = 40;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 42:
          _context20.prev = 42;

          if (!_didIteratorError5) {
            _context20.next = 45;
            break;
          }

          throw _iteratorError5;

        case 45:
          return _context20.finish(42);

        case 46:
          return _context20.finish(39);

        case 47:
          // INSERT SESSION TO TIMETABLE
          insertSession = function insertSession(group, day, startTime, duration, type, method, repeat) {
            return regeneratorRuntime.async(function insertSession$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    return _context19.abrupt("return", new Promise(function (resolve, reject) {
                      var query = 'INSERT INTO timetable(T_group,Day,Start_time,Duration,Type,Method,Session_repeat) VALUES (' + group + ',' + day + ',"' + startTime + '",' + duration + ',' + type + ',' + method + ',' + repeat + ')';
                      conn.query(query, function (err, result) {
                        if (err) reject(err);else resolve(result);
                      });
                    }));

                  case 1:
                  case "end":
                    return _context19.stop();
                }
              }
            });
          };

          _context20.prev = 48;
          _context20.next = 51;
          return regeneratorRuntime.awrap(insertSession(group, day, startTime, duration, type, method, repeat));

        case 51:
          result = _context20.sent;
          _context20.next = 59;
          break;

        case 54:
          _context20.prev = 54;
          _context20.t2 = _context20["catch"](48);
          console.log(_context20.t2);
          res.send({
            status: '500',
            error: _context20.t2
          });
          return _context20.abrupt("return");

        case 59:
          if (!(result.affectedRows == 0)) {
            _context20.next = 64;
            break;
          }

          res.send({
            status: '500'
          });
          return _context20.abrupt("return");

        case 64:
          res.send({
            status: '200'
          });
          return _context20.abrupt("return");

        case 66:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[8, 14], [23, 35, 39, 47], [40,, 42, 46], [48, 54]]);
};

exports.stu_view = function _callee13(req, res) {
  var employee_details, faculties, batches, degrees, students;
  return regeneratorRuntime.async(function _callee13$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          console.log('Starting controller...');
          faculties = [], batches = [], degrees = [], students = [];
          _context21.next = 4;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 4:
          employee_details = _context21.sent;
          _context21.prev = 5;
          _context21.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getFaculties(conn, null));

        case 8:
          faculties = _context21.sent;
          console.log(faculties);
          _context21.next = 15;
          break;

        case 12:
          _context21.prev = 12;
          _context21.t0 = _context21["catch"](5);
          console.log('Error : ' + _context21.t0);

        case 15:
          _context21.prev = 15;
          _context21.next = 18;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 18:
          batches = _context21.sent;
          console.log(batches);
          _context21.next = 25;
          break;

        case 22:
          _context21.prev = 22;
          _context21.t1 = _context21["catch"](15);
          console.log('Error : ' + _context21.t1);

        case 25:
          _context21.prev = 25;
          _context21.next = 28;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 28:
          degrees = _context21.sent;
          console.log(degrees);
          _context21.next = 35;
          break;

        case 32:
          _context21.prev = 32;
          _context21.t2 = _context21["catch"](25);
          console.log('Error : ' + _context21.t2);

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
          return _context21.stop();
      }
    }
  }, null, null, [[5, 12], [15, 22], [25, 32]]);
}; // RETRIEVE STUDENTS FILTERED BY FACULTY, BATCH AND DEGREE


exports.stu_get_filtered = function _callee14(req, res) {
  var fac, batch, deg, students, sql;
  return regeneratorRuntime.async(function _callee14$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
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
          _context22.prev = 8;
          _context22.next = 11;
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
          students = _context22.sent;
          res.send({
            status: '200',
            students: students
          });
          _context22.next = 19;
          break;

        case 15:
          _context22.prev = 15;
          _context22.t0 = _context22["catch"](8);
          console.log(_context22.t0);
          res.send({
            status: '500',
            students: students
          });

        case 19:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[8, 15]]);
};

exports.stu_get_profile = function _callee15(req, res) {
  var search_index, search_keyword, employee_details, student, groups, modules, sessions, attendances, sql, degree, deg, bat, batch, id_list, _row, attendanceLoop, present, session_count, percentage, _row2, key;

  return regeneratorRuntime.async(function _callee15$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          console.log('Function starting... stu profile');
          search_index = req.query.searchoption;
          search_keyword = req.query.keyword;
          _context24.next = 5;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 5:
          employee_details = _context24.sent;
          sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch,Telephone,Address FROM students';

          if (search_index == 0) {
            sql += ' WHERE IndexNo = "' + search_keyword + '"';
          } else if (search_index == 1) {
            sql += ' WHERE Name = "' + search_keyword + '"';
          } else if (search_index == 2) {
            sql += ' WHERE Email = "' + search_keyword + '"';
          }

          _context24.prev = 8;
          _context24.next = 11;
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
          student = _context24.sent;
          _context24.next = 18;
          break;

        case 14:
          _context24.prev = 14;
          _context24.t0 = _context24["catch"](8);
          console.log(_context24.t0);
          res.send({
            status: '500',
            student: student
          });

        case 18:
          if (!(student.length == 0)) {
            _context24.next = 23;
            break;
          }

          res.status(201).send({
            res: 'No such students'
          });
          return _context24.abrupt("return");

        case 23:
          //RETRIEVING DEGREE OF THE STUDENT
          degree = [student[0].Degree];
          _context24.prev = 24;
          _context24.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, degree));

        case 27:
          deg = _context24.sent;
          student[0].Degree = deg[0].Degree;
          _context24.next = 34;
          break;

        case 31:
          _context24.prev = 31;
          _context24.t1 = _context24["catch"](24);
          console.log('Error : ' + _context24.t1);

        case 34:
          //RETRIEVING Batch OF THE STUDENT
          batch = [student[0].Batch];
          _context24.prev = 35;
          _context24.next = 38;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, batch));

        case 38:
          bat = _context24.sent;
          student[0].Batch = bat[0].Batch;
          _context24.next = 45;
          break;

        case 42:
          _context24.prev = 42;
          _context24.t2 = _context24["catch"](35);
          console.log('Error : ' + _context24.t2);

        case 45:
          _context24.prev = 45;
          _context24.next = 48;
          return regeneratorRuntime.awrap(commonFunctions.getGroupsOfAStudent(conn, student[0].id));

        case 48:
          groups = _context24.sent;
          console.log("Student Groups");
          console.log(groups);
          _context24.next = 56;
          break;

        case 53:
          _context24.prev = 53;
          _context24.t3 = _context24["catch"](45);
          console.log('Error : ' + _context24.t3);

        case 56:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Stu_group);
          }); // RETRIEVING ALL GROUPS RELEVANT TO THE STUDENT

          _context24.prev = 58;
          _context24.next = 61;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, id_list, null, 1));

        case 61:
          groups = _context24.sent;
          console.log(groups);
          _context24.next = 68;
          break;

        case 65:
          _context24.prev = 65;
          _context24.t4 = _context24["catch"](58);
          console.log('Error : ' + _context24.t4);

        case 68:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Module);
          }); // RETRIEVING ALL MODULES RELEVANT TO THE STUDENT

          _context24.prev = 70;
          _context24.next = 73;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, id_list));

        case 73:
          modules = _context24.sent;
          console.log(modules);
          _context24.next = 80;
          break;

        case 77:
          _context24.prev = 77;
          _context24.t5 = _context24["catch"](70);
          console.log('Error : ' + _context24.t5);

        case 80:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.id);
          }); // RETRIEVING ALL SESSIONS RELEVANT TO THE GROUPS

          _context24.prev = 82;
          _context24.next = 85;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, id_list, 1));

        case 85:
          sessions = _context24.sent;
          console.log(sessions);
          _context24.next = 92;
          break;

        case 89:
          _context24.prev = 89;
          _context24.t6 = _context24["catch"](82);
          console.log('Error : ' + _context24.t6);

        case 92:
          //RETIEVING ALL ATTENDANCE ROWS OF SELECTED STUDENT RELEVANT TO EACH STUDENT GROUP
          attendances = [];
          _row = [];

          attendanceLoop = function attendanceLoop(_) {
            return regeneratorRuntime.async(function attendanceLoop$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    _context23.t0 = regeneratorRuntime.keys(groups);

                  case 1:
                    if ((_context23.t1 = _context23.t0()).done) {
                      _context23.next = 16;
                      break;
                    }

                    grp = _context23.t1.value;
                    _context23.prev = 3;
                    _context23.next = 6;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, groups[grp].id));

                  case 6:
                    _row = _context23.sent;

                    _row.push({
                      group: groups[grp].id
                    }); //console.log(row);


                    attendances.push(_row);
                    _context23.next = 14;
                    break;

                  case 11:
                    _context23.prev = 11;
                    _context23.t2 = _context23["catch"](3);
                    console.log('Error : ' + _context23.t2);

                  case 14:
                    _context23.next = 1;
                    break;

                  case 16:
                  case "end":
                    return _context23.stop();
                }
              }
            }, null, null, [[3, 11]]);
          };

          _context24.next = 97;
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
          return _context24.stop();
      }
    }
  }, null, null, [[8, 14], [24, 31], [35, 42], [45, 53], [58, 65], [70, 77], [82, 89]]);
}; // RETRIEVE VIEW RELATED TO PAST REPORTS SECTION


exports.past_reports_view = function _callee16(req, res) {
  var employee_details, groups, modules, batches, degrees;
  return regeneratorRuntime.async(function _callee16$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          console.log('Function starting... get_past_reports');
          _context25.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context25.sent;
          _context25.prev = 4;
          _context25.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context25.sent;
          console.log(batches);
          _context25.next = 14;
          break;

        case 11:
          _context25.prev = 11;
          _context25.t0 = _context25["catch"](4);
          console.log('Error : ' + _context25.t0);

        case 14:
          _context25.prev = 14;
          _context25.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 17:
          modules = _context25.sent;
          console.log(modules);
          _context25.next = 24;
          break;

        case 21:
          _context25.prev = 21;
          _context25.t1 = _context25["catch"](14);
          console.log('Error : ' + _context25.t1);

        case 24:
          _context25.prev = 24;
          _context25.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 27:
          degrees = _context25.sent;
          console.log(degrees);
          _context25.next = 34;
          break;

        case 31:
          _context25.prev = 31;
          _context25.t2 = _context25["catch"](24);
          console.log('Error : ' + _context25.t2);

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
          return _context25.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21], [24, 31]]);
}; // RETRIEVE GROUPS RELATED TO THE MODULE SELECTED BY THE USER


exports.past_get_groups = function _callee17(req, res) {
  var module, batch, modules, groups, matchingGroups;
  return regeneratorRuntime.async(function _callee17$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          module = req.query.module;
          batch = req.query.batch;
          console.log(module);
          modules = [module];
          groups = [];
          _context26.prev = 5;
          _context26.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, modules, null, 2));

        case 8:
          groups = _context26.sent;
          console.log(groups);
          _context26.next = 16;
          break;

        case 12:
          _context26.prev = 12;
          _context26.t0 = _context26["catch"](5);
          console.log('Error : ' + _context26.t0);
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
          return _context26.stop();
      }
    }
  }, null, null, [[5, 12]]);
}; // RETRIEVE SESSIONS ACCORDING TO THE GIVEN BATCH, MODULE AND GROUP


exports.past_get_sessions = function _callee18(req, res) {
  var group, groups, sessions, lecturers, lec_id, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _session3;

  return regeneratorRuntime.async(function _callee18$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          group = req.query.group;
          groups = [group];
          _context27.prev = 2;
          _context27.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, groups, 1));

        case 5:
          sessions = _context27.sent;
          console.log(sessions);
          _context27.next = 13;
          break;

        case 9:
          _context27.prev = 9;
          _context27.t0 = _context27["catch"](2);
          console.log('Error : ' + _context27.t0);
          res.send({
            status: '500',
            sessions: sessions
          });

        case 13:
          if (!(sessions.length == 0)) {
            _context27.next = 16;
            break;
          }

          res.send({
            status: '200',
            sessions: sessions
          });
          return _context27.abrupt("return");

        case 16:
          lec_id = [];
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context27.prev = 20;

          for (_iterator6 = sessions[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            _session3 = _step6.value;
            lec_id.push(_session3.Lecturer);
          }

          _context27.next = 28;
          break;

        case 24:
          _context27.prev = 24;
          _context27.t1 = _context27["catch"](20);
          _didIteratorError6 = true;
          _iteratorError6 = _context27.t1;

        case 28:
          _context27.prev = 28;
          _context27.prev = 29;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 31:
          _context27.prev = 31;

          if (!_didIteratorError6) {
            _context27.next = 34;
            break;
          }

          throw _iteratorError6;

        case 34:
          return _context27.finish(31);

        case 35:
          return _context27.finish(28);

        case 36:
          lec_id = _toConsumableArray(new Set(lec_id));
          _context27.prev = 37;
          _context27.next = 40;
          return regeneratorRuntime.awrap(commonFunctions.getEmployeeDetails(conn, lec_id, ['id', 'Name'], 0));

        case 40:
          lecturers = _context27.sent;
          _context27.next = 47;
          break;

        case 43:
          _context27.prev = 43;
          _context27.t2 = _context27["catch"](37);
          console.log('Error : ' + _context27.t2);
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
          return _context27.stop();
      }
    }
  }, null, null, [[2, 9], [20, 24, 28, 36], [29,, 31, 35], [37, 43]]);
};

exports.past_get_sessionattendance = function _callee19(req, res) {
  var session, group, attendance, students;
  return regeneratorRuntime.async(function _callee19$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          session = [];
          session.push(req.query.session);
          attendance = [];

          if (!(req.query.group == 'null')) {
            _context28.next = 20;
            break;
          }

          _context28.prev = 4;
          _context28.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, session, 2));

        case 7:
          session = _context28.sent;
          console.log(session);
          _context28.next = 16;
          break;

        case 11:
          _context28.prev = 11;
          _context28.t0 = _context28["catch"](4);
          console.log('Error : ' + _context28.t0);
          res.send({
            status: '500',
            attendance: []
          });
          return _context28.abrupt("return");

        case 16:
          group = session[0].Ses_group;
          session = session[0].id;
          _context28.next = 22;
          break;

        case 20:
          group = req.query.group;
          session = req.query.session;

        case 22:
          _context28.prev = 22;
          _context28.next = 25;
          return regeneratorRuntime.awrap(commonFunctions.getAttendanceofSession(conn, session, group));

        case 25:
          attendance = _context28.sent;
          console.log(attendance);
          _context28.next = 34;
          break;

        case 29:
          _context28.prev = 29;
          _context28.t1 = _context28["catch"](22);
          console.log('Error : ' + _context28.t1);
          res.send({
            status: '500',
            attendance: []
          });
          return _context28.abrupt("return");

        case 34:
          if (!(attendance.length == 0)) {
            _context28.next = 37;
            break;
          }

          res.send({
            status: '200',
            attendance: []
          });
          return _context28.abrupt("return");

        case 37:
          students = [];

          for (student in attendance) {
            students.push([attendance[student].Student]);
          }

          _context28.prev = 39;
          _context28.next = 42;
          return regeneratorRuntime.awrap(commonFunctions.getStudentsFiltered(conn, students, 0));

        case 42:
          students = _context28.sent;
          console.log(students);
          _context28.next = 51;
          break;

        case 46:
          _context28.prev = 46;
          _context28.t2 = _context28["catch"](39);
          console.log('Error : ' + _context28.t2);
          res.send({
            status: '500',
            attendance: []
          });
          return _context28.abrupt("return");

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
          return _context28.stop();
      }
    }
  }, null, null, [[4, 11], [22, 29], [39, 46]]);
}; // GET PAGE OF GETTING ATTENDANCE OF A SPECIFIC MODULE AND BATCH


exports.past_moduleattendance_view = function _callee20(req, res) {
  var employee_details, modules, batches;
  return regeneratorRuntime.async(function _callee20$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          console.log('Function starting... get past module attendance');
          _context29.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context29.sent;
          _context29.prev = 4;
          _context29.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context29.sent;
          console.log(batches);
          _context29.next = 14;
          break;

        case 11:
          _context29.prev = 11;
          _context29.t0 = _context29["catch"](4);
          console.log('Error : ' + _context29.t0);

        case 14:
          _context29.prev = 14;
          _context29.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 17:
          modules = _context29.sent;
          console.log(modules);
          _context29.next = 24;
          break;

        case 21:
          _context29.prev = 21;
          _context29.t1 = _context29["catch"](14);
          console.log('Error : ' + _context29.t1);

        case 24:
          res.render('nonacademic_moduleattendance', {
            employee: employee_details,
            batches: batches,
            modules: modules
          });

        case 25:
        case "end":
          return _context29.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET ATTENDANCE OF SPECIFIC MODULE AND BATCH


exports.past_moduleattendance = function _callee21(req, res) {
  var module, batch, matchingGroups, getAttendance, attendance_of_groups, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _group, current_group_attendance, present, session_count, percentage, finalAttendance, studentAttendance, _i, _attendance_of_groups, _group2, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _student2, key;

  return regeneratorRuntime.async(function _callee21$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          module = req.query.module;
          batch = req.query.batch;
          _context31.prev = 2;
          _context31.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, [module], [batch], 2));

        case 5:
          matchingGroups = _context31.sent;
          console.log(matchingGroups);
          _context31.next = 13;
          break;

        case 9:
          _context31.prev = 9;
          _context31.t0 = _context31["catch"](2);
          res.send({
            status: '500'
          });
          return _context31.abrupt("return");

        case 13:
          getAttendance = function getAttendance(group) {
            return regeneratorRuntime.async(function getAttendance$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    return _context30.abrupt("return", new Promise(function (resolve, reject) {
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
                    return _context30.stop();
                }
              }
            });
          };

          attendance_of_groups = [];
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context31.prev = 18;
          _iterator7 = matchingGroups[Symbol.iterator]();

        case 20:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context31.next = 38;
            break;
          }

          _group = _step7.value;
          current_group_attendance = [];
          _context31.prev = 23;
          _context31.next = 26;
          return regeneratorRuntime.awrap(getAttendance(_group.id));

        case 26:
          current_group_attendance = _context31.sent;
          attendance_of_groups.push(current_group_attendance);
          _context31.next = 35;
          break;

        case 30:
          _context31.prev = 30;
          _context31.t1 = _context31["catch"](23);
          console.log('Error : ' + _context31.t1);
          res.send({
            status: '500'
          });
          return _context31.abrupt("return");

        case 35:
          _iteratorNormalCompletion7 = true;
          _context31.next = 20;
          break;

        case 38:
          _context31.next = 44;
          break;

        case 40:
          _context31.prev = 40;
          _context31.t2 = _context31["catch"](18);
          _didIteratorError7 = true;
          _iteratorError7 = _context31.t2;

        case 44:
          _context31.prev = 44;
          _context31.prev = 45;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 47:
          _context31.prev = 47;

          if (!_didIteratorError7) {
            _context31.next = 50;
            break;
          }

          throw _iteratorError7;

        case 50:
          return _context31.finish(47);

        case 51:
          return _context31.finish(44);

        case 52:
          finalAttendance = [];
          studentAttendance = [];
          _i = 0, _attendance_of_groups = attendance_of_groups;

        case 55:
          if (!(_i < _attendance_of_groups.length)) {
            _context31.next = 82;
            break;
          }

          _group2 = _attendance_of_groups[_i];
          present = 0;
          session_count = 0;

          if (!(_group2.length > 0)) {
            _context31.next = 79;
            break;
          }

          _iteratorNormalCompletion8 = true;
          _didIteratorError8 = false;
          _iteratorError8 = undefined;
          _context31.prev = 63;

          for (_iterator8 = _group2[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            _student2 = _step8.value;
            studentAttendance = [];
            present = 0;
            session_count = 0;

            for (key in _student2) {
              if (key != 'id' && key != 'Student' && key != 'IndexNo' && key != 'Name' && key != 'Degree') {
                session_count++;

                if (_student2[key] != 0) {
                  present++;
                }
              }
            }

            session_count == 0 ? percentage = 100 : percentage = present / session_count * 100;
            studentAttendance = {
              index: _student2.IndexNo,
              name: _student2.Name,
              degree: _student2.Degree,
              percentage: percentage
            };
            finalAttendance.push(studentAttendance);
          }

          _context31.next = 71;
          break;

        case 67:
          _context31.prev = 67;
          _context31.t3 = _context31["catch"](63);
          _didIteratorError8 = true;
          _iteratorError8 = _context31.t3;

        case 71:
          _context31.prev = 71;
          _context31.prev = 72;

          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }

        case 74:
          _context31.prev = 74;

          if (!_didIteratorError8) {
            _context31.next = 77;
            break;
          }

          throw _iteratorError8;

        case 77:
          return _context31.finish(74);

        case 78:
          return _context31.finish(71);

        case 79:
          _i++;
          _context31.next = 55;
          break;

        case 82:
          res.send({
            status: '200',
            attendance: finalAttendance
          });

        case 83:
        case "end":
          return _context31.stop();
      }
    }
  }, null, null, [[2, 9], [18, 40, 44, 52], [23, 30], [45,, 47, 51], [63, 67, 71, 79], [72,, 74, 78]]);
}; // GET PAGE FOR THE ATTENDANCE REPORT OF A SPECIFIC BATCH AND A DEGREE


exports.past_degreeattendance_view = function _callee22(req, res) {
  var employee_details, degrees, batches;
  return regeneratorRuntime.async(function _callee22$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          console.log('Function starting... get past degree attendance');
          _context32.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context32.sent;
          _context32.prev = 4;
          _context32.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context32.sent;
          console.log(batches);
          _context32.next = 14;
          break;

        case 11:
          _context32.prev = 11;
          _context32.t0 = _context32["catch"](4);
          console.log('Error : ' + _context32.t0);

        case 14:
          _context32.prev = 14;
          _context32.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 17:
          degrees = _context32.sent;
          console.log(degrees);
          _context32.next = 24;
          break;

        case 21:
          _context32.prev = 21;
          _context32.t1 = _context32["catch"](14);
          console.log('Error : ' + _context32.t1);

        case 24:
          res.render('nonacademic_degreeattendance', {
            employee: employee_details,
            batches: batches,
            degrees: degrees
          });

        case 25:
        case "end":
          return _context32.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET ATTENDANCE REPORT OF A SPECIFIC BATCH AND A DEGREE


exports.past_degreeattendance = function _callee23(req, res) {
  var degree, batch, matchingGroups, getGroups;
  return regeneratorRuntime.async(function _callee23$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
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

          _context33.prev = 3;
          _context33.next = 6;
          return regeneratorRuntime.awrap(getGroups(degree, batch));

        case 6:
          matchingGroups = _context33.sent;
          console.log(matchingGroups);
          _context33.next = 14;
          break;

        case 10:
          _context33.prev = 10;
          _context33.t0 = _context33["catch"](3);
          console.log('Error : ' + _context33.t0);
          res.send({
            status: '500'
          });

        case 14:
        case "end":
          return _context33.stop();
      }
    }
  }, null, null, [[3, 10]]);
}; // GET REQUIRED DETAILS TO LOAD TIME TABLE SCREEN


exports.timetable_view = function _callee24(req, res) {
  var employee_details, degrees, batches;
  return regeneratorRuntime.async(function _callee24$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          console.log('Function starting... get time table');
          _context34.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context34.sent;
          _context34.prev = 4;
          _context34.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context34.sent;
          console.log(batches);
          _context34.next = 14;
          break;

        case 11:
          _context34.prev = 11;
          _context34.t0 = _context34["catch"](4);
          console.log('Error : ' + _context34.t0);

        case 14:
          _context34.prev = 14;
          _context34.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 17:
          degrees = _context34.sent;
          console.log(degrees);
          _context34.next = 24;
          break;

        case 21:
          _context34.prev = 21;
          _context34.t1 = _context34["catch"](14);
          console.log('Error : ' + _context34.t1);

        case 24:
          res.render('nonacademic_timetable', {
            employee: employee_details,
            batches: batches,
            degrees: degrees
          });

        case 25:
        case "end":
          return _context34.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET LECTURES RELEVANT TO GIVEN DAY, BATCH AND DEGREE


exports.timetable_getlectures = function _callee25(req, res) {
  var day, batch, degree, groups, group_ids, modules, lectures;
  return regeneratorRuntime.async(function _callee25$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          day = req.query.day;
          batch = [];
          batch.push(req.query.batch);
          degree = req.query.degree;
          console.log(day);
          groups = [];
          _context35.prev = 6;
          _context35.next = 9;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, batch, null, 3));

        case 9:
          groups = _context35.sent;
          console.log('groups of the batch');
          console.log(groups);
          _context35.next = 19;
          break;

        case 14:
          _context35.prev = 14;
          _context35.t0 = _context35["catch"](6);
          console.log('Error : ' + _context35.t0);
          res.send({
            status: '500',
            lectures: []
          });
          return _context35.abrupt("return");

        case 19:
          if (!(groups.length == 0)) {
            _context35.next = 22;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context35.abrupt("return");

        case 22:
          group_ids = [], modules = [];

          for (group in groups) {
            group_ids.push(groups[group].id);
          }

          _context35.prev = 24;
          _context35.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getGroups_DegreeFiltered(conn, degree, group_ids));

        case 27:
          groups = _context35.sent;
          console.log('groups of the batch and degree');
          console.log(groups);
          _context35.next = 37;
          break;

        case 32:
          _context35.prev = 32;
          _context35.t1 = _context35["catch"](24);
          console.log('Error : ' + _context35.t1);
          res.send({
            status: '500',
            lectures: []
          });
          return _context35.abrupt("return");

        case 37:
          if (!(groups.length == 0)) {
            _context35.next = 40;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context35.abrupt("return");

        case 40:
          group_ids = [];

          for (group in groups) {
            group_ids.push(groups[group].Stu_group);
          }

          lectures = [];
          _context35.prev = 43;
          _context35.next = 46;
          return regeneratorRuntime.awrap(commonFunctions.getTimeTable(conn, day, group_ids));

        case 46:
          lectures = _context35.sent;
          console.log('time table of the batch, degree and day');
          console.log(lectures);
          _context35.next = 56;
          break;

        case 51:
          _context35.prev = 51;
          _context35.t2 = _context35["catch"](43);
          console.log('Error : ' + _context35.t2);
          res.send({
            status: '500',
            lectures: []
          });
          return _context35.abrupt("return");

        case 56:
          if (!(lectures.length == 0)) {
            _context35.next = 59;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context35.abrupt("return");

        case 59:
          group_ids = [];

          for (lecture in lectures) {
            group_ids.push(lectures[lecture].T_group);
          }

          _context35.prev = 61;
          _context35.next = 64;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, group_ids, null, 1));

        case 64:
          groups = _context35.sent;
          console.log('groups that have lectures on the day in selected batch and degree');
          console.log(groups);
          _context35.next = 74;
          break;

        case 69:
          _context35.prev = 69;
          _context35.t3 = _context35["catch"](61);
          console.log('Error : ' + _context35.t3);
          res.send({
            status: '500',
            lectures: []
          });
          return _context35.abrupt("return");

        case 74:
          if (!(groups.length == 0)) {
            _context35.next = 77;
            break;
          }

          res.send({
            status: '200',
            lectures: []
          });
          return _context35.abrupt("return");

        case 77:
          for (group in groups) {
            modules.push(groups[group].Module);
          }

          _context35.prev = 78;
          _context35.next = 81;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, modules));

        case 81:
          modules = _context35.sent;
          console.log('modules of relvant groups');
          console.log(modules);
          _context35.next = 91;
          break;

        case 86:
          _context35.prev = 86;
          _context35.t4 = _context35["catch"](78);
          console.log('Error : ' + _context35.t4);
          res.send({
            status: '500',
            lectures: []
          });
          return _context35.abrupt("return");

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
          return _context35.stop();
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
  return regeneratorRuntime.async(function load_attendance_of_a_student$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          attendances = [];
          row = [];
          groups.forEach(function _callee26(element) {
            return regeneratorRuntime.async(function _callee26$(_context36) {
              while (1) {
                switch (_context36.prev = _context36.next) {
                  case 0:
                    _context36.prev = 0;
                    _context36.next = 3;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, element.id));

                  case 3:
                    row = _context36.sent;
                    row.push({
                      group: element.id
                    });
                    console.log(row);
                    attendances.push(row);
                    _context36.next = 12;
                    break;

                  case 9:
                    _context36.prev = 9;
                    _context36.t0 = _context36["catch"](0);
                    console.log('Error : ' + _context36.t0);

                  case 12:
                  case "end":
                    return _context36.stop();
                }
              }
            }, null, null, [[0, 9]]);
          });

        case 3:
        case "end":
          return _context37.stop();
      }
    }
  });
} // GET EMPLOYEE DETAILS, MATCHING DESIGNATIONS


function loadInitialDetails() {
  var employee_details, designations;
  return regeneratorRuntime.async(function loadInitialDetails$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          console.log(process.env.CURRENT_ID); // RETRIEVING ID AND THE DESIGNATION OF THE EMPLOYEE

          _context38.prev = 1;
          _context38.next = 4;
          return regeneratorRuntime.awrap(getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']));

        case 4:
          employee_details = _context38.sent;
          _context38.next = 10;
          break;

        case 7:
          _context38.prev = 7;
          _context38.t0 = _context38["catch"](1);
          console.log('Error : ' + _context38.t0);

        case 10:
          _context38.prev = 10;
          _context38.next = 13;
          return regeneratorRuntime.awrap(commonFunctions.getDesignations(conn));

        case 13:
          designations = _context38.sent;
          _context38.next = 19;
          break;

        case 16:
          _context38.prev = 16;
          _context38.t1 = _context38["catch"](10);
          console.log('Error : ' + _context38.t1);

        case 19:
          // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
          designations.forEach(function (element) {
            if (element.id == employee_details[0].Designation) {
              employee_details[0].Designation = element.Name;
              return;
            }
          });
          return _context38.abrupt("return", employee_details);

        case 21:
        case "end":
          return _context38.stop();
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