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
  var email, loadUserDetails;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.body.email;

          loadUserDetails = function loadUserDetails(email) {
            return new Promise(function (resolve, reject) {
              var sql = 'SELECT id,Designation FROM employees WHERE Email = "' + email + '"';
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
              process.env.CURRENT_ID = rows[0].id;
              process.env.CURRENT_TYPE = rows[0].Designation;
              res.send({
                status: '200',
                type: rows[0].Designation
              });
            }
          })["catch"](function (err) {
            console.log(err);
            res.send({
              status: '500',
              message: 'Internal Server Error'
            });
          });

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};