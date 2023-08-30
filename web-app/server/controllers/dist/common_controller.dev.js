"use strict";

var mysql = require('mysql2');

var commonFunctions = require('./common_functions');

var nonacademic_controller = require('./nonacademic_controller'); // MYSQL CONNECTION (CHANGE .env FILE WHEN TESTING. DON'T EDIT THESE PARAMETERS)


var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_TOKEN,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

exports.sign_in_view = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.render('sign-in');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.continue_sign_in = function _callee2(req, res) {
  var email, password, loadUserDetails;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.body.email;
          password = req.body.password;

          loadUserDetails = function loadUserDetails(email) {
            return new Promise(function (resolve, reject) {
              var sql = 'SELECT id,Designation,Password FROM employees WHERE Email = "' + email + '"';
              conn.query(sql, function (err, rows) {
                if (!err) {
                  return resolve(rows);
                } else {
                  return reject(err);
                }
              });
            });
          };

          loadUserDetails(email).then(function (rows) {
            if (rows.length == 0) {
              res.send({
                status: '201',
                message: 'User not found'
              });
            } else {
              if (rows[0].Password == password) {
                process.env.CURRENT_ID = rows[0].id;
                process.env.CURRENT_TYPE = rows[0].Designation;
                res.send({
                  status: '200',
                  type: rows[0].Designation
                });
              } else {
                res.send({
                  status: '202',
                  message: 'Incorrect password'
                });
              }
            }
          })["catch"](function (err) {
            console.log(err);
            res.send({
              status: '500',
              message: 'Internal Server Error'
            });
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.continue_sign_out = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          process.env.CURRENT_ID = "";
          process.env.CURRENT_TYPE = "";
          res.render('sign-in');

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.postattendance = function _callee4(req, res) {
  var api_key, session_id, attendance, getStudentGroup, studentGroup, updatingSQL, student_uid, attendance_time, studentIDs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, studentAttendance, updateAttendance, result;

  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          api_key = 'tPmAT5Ab3j7F9';
          console.log("Started");

          if (!(req.body.api_key != api_key)) {
            _context6.next = 6;
            break;
          }

          console.log("Wrong API key");
          res.send(212);
          return _context6.abrupt("return");

        case 6:
          session_id = req.body.session_id;
          attendance = req.body.attendance;
          console.log(session_id, attendance); // Select the student group of the session

          getStudentGroup = function getStudentGroup(session_id) {
            return regeneratorRuntime.async(function getStudentGroup$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    return _context4.abrupt("return", new Promise(function (resolve, reject) {
                      var sql = 'SELECT Ses_group FROM sessions WHERE id = ' + session_id;
                      conn.query(sql, function (err, rows) {
                        if (!err) {
                          return resolve(rows);
                        } else {
                          return reject(err);
                        }
                      });
                    }));

                  case 1:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          };

          console.log("Loading student group");
          _context6.prev = 11;
          _context6.next = 14;
          return regeneratorRuntime.awrap(getStudentGroup(session_id));

        case 14:
          studentGroup = _context6.sent;
          _context6.next = 22;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](11);
          console.log(_context6.t0);
          res.send({
            status: 500
          });
          return _context6.abrupt("return");

        case 22:
          if (!(studentGroup.length == 0 || studentGroup == null)) {
            _context6.next = 26;
            break;
          }

          console.log("No student group found");
          res.send({
            staus: 201
          });
          return _context6.abrupt("return");

        case 26:
          studentGroup = studentGroup[0].Ses_group;
          updatingSQL = 'UPDATE attendance_' + studentGroup + ' SET ses' + session_id + ' = CASE ';
          studentIDs = '';
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context6.prev = 32;

          for (_iterator = attendance[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            studentAttendance = _step.value;
            student_uid = studentAttendance.substring(0, studentAttendance.length - 9);
            attendance_time = studentAttendance.substring(studentAttendance.length - 8);
            updatingSQL += 'WHEN Student = "' + student_uid + '" THEN "' + attendance_time + '" ';
            studentIDs += '"' + student_uid + '",';
          }

          _context6.next = 40;
          break;

        case 36:
          _context6.prev = 36;
          _context6.t1 = _context6["catch"](32);
          _didIteratorError = true;
          _iteratorError = _context6.t1;

        case 40:
          _context6.prev = 40;
          _context6.prev = 41;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 43:
          _context6.prev = 43;

          if (!_didIteratorError) {
            _context6.next = 46;
            break;
          }

          throw _iteratorError;

        case 46:
          return _context6.finish(43);

        case 47:
          return _context6.finish(40);

        case 48:
          updatingSQL += 'END WHERE Student IN (' + studentIDs.substring(0, studentIDs.length - 1) + ')';
          console.log(updatingSQL);

          updateAttendance = function updateAttendance(updatingSQL) {
            return regeneratorRuntime.async(function updateAttendance$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    return _context5.abrupt("return", new Promise(function (resolve, reject) {
                      conn.query(updatingSQL, function (err, rows) {
                        if (!err) {
                          return resolve(rows);
                        } else {
                          return reject(err);
                        }
                      });
                    }));

                  case 1:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          };

          console.log("Updating attendance");
          _context6.prev = 52;
          _context6.next = 55;
          return regeneratorRuntime.awrap(updateAttendance(updatingSQL));

        case 55:
          result = _context6.sent;
          _context6.next = 63;
          break;

        case 58:
          _context6.prev = 58;
          _context6.t2 = _context6["catch"](52);
          console.log(_context6.t2);
          res.send({
            status: 500
          });
          return _context6.abrupt("return");

        case 63:
          if (result) {
            _context6.next = 69;
            break;
          }

          console.log("Error updating attendance");
          res.send({
            status: 201
          });
          return _context6.abrupt("return");

        case 69:
          console.log("Attendance updated");
          res.send({
            status: 200
          });
          return _context6.abrupt("return");

        case 72:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[11, 17], [32, 36, 40, 48], [41,, 43, 47], [52, 58]]);
};