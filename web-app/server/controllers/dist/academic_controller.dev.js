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
  var employee_details, designations, groups_of_employee, modules, batches, ava_in_array, ava_in_array_2, group_ids;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Starting controller...');
          modules = [], batches = [];
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']));

        case 5:
          employee_details = _context.sent;
          console.log(employee_details);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          console.log('Error : ' + _context.t0);

        case 12:
          _context.prev = 12;
          _context.next = 15;
          return regeneratorRuntime.awrap(commonFunctions.getDesignations(conn));

        case 15:
          designations = _context.sent;
          console.log(designations);
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t1 = _context["catch"](12);
          console.log('Error : ' + _context.t1);

        case 22:
          // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
          designations.forEach(function (element) {
            if (element.id == employee_details[0].Designation) {
              employee_details[0].Designation = element.Name;
              return;
            }
          }); // RETREIVING GROUPS OF EMPLOYEE

          _context.prev = 23;
          _context.next = 26;
          return regeneratorRuntime.awrap(commonFunctions.getGroupsofEmployee(conn, process.env.CURRENT_ID));

        case 26:
          groups_of_employee = _context.sent;
          console.log(groups_of_employee);
          _context.next = 33;
          break;

        case 30:
          _context.prev = 30;
          _context.t2 = _context["catch"](23);
          console.log('Error : ' + _context.t2);

        case 33:
          group_ids = [];
          groups_of_employee.forEach(function (element) {
            group_ids.push(element.Emp_group);
          }); // RETRIEVING DETAILS OF LOADED GROUPS

          _context.prev = 35;
          _context.next = 38;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, group_ids, 1));

        case 38:
          groups_of_employee = _context.sent;
          console.log(groups_of_employee);
          _context.next = 45;
          break;

        case 42:
          _context.prev = 42;
          _context.t3 = _context["catch"](35);
          console.log('Error : ' + _context.t3);

        case 45:
          // REMOVING DUPLICATE MODULES AND BATCHES FROM STUDENT_GROUP LIST
          groups_of_employee.forEach(function (element) {
            ava_in_array = false;
            ava_in_array_2 = false;
            var str = element.Name.split('-')[1];
            element.Name = 'Group ' + str.substring(3, str.length);
            modules.forEach(function (element2) {
              if (element2 == element.Module) {
                ava_in_array = true;
                return;
              }
            });
            batches.forEach(function (element3) {
              if (element3 == element.Batch) {
                ava_in_array_2 = true;
                return;
              }
            });

            if (!ava_in_array) {
              modules.push(element.Module);
            }

            if (!ava_in_array_2) {
              batches.push(element.Batch);
            }
          }); // LOADING DETAILS OF THE MODULE

          _context.prev = 46;
          _context.next = 49;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, modules));

        case 49:
          modules = _context.sent;
          console.log(modules);
          _context.next = 56;
          break;

        case 53:
          _context.prev = 53;
          _context.t4 = _context["catch"](46);
          console.log('Error : ' + _context.t4);

        case 56:
          _context.prev = 56;
          _context.next = 59;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, batches));

        case 59:
          batches = _context.sent;
          console.log(batches);
          _context.next = 66;
          break;

        case 63:
          _context.prev = 63;
          _context.t5 = _context["catch"](56);
          console.log('Error : ' + _context.t5);

        case 66:
          console.log('finishing...'); // RENDERING THE VIEW

          res.render('sample_view_2', {
            title: 'title',
            employee: employee_details,
            modules: modules,
            batches: batches,
            groups: groups_of_employee
          });

        case 68:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9], [12, 19], [23, 30], [35, 42], [46, 53], [56, 63]]);
};

exports.get_dept = function (req, res) {
  console.log('Function accessed...');
  conn.query('SELECT * FROM departments WHERE Faculty = ' + req.params.fac, function (err, rows) {
    !err ? console.log(rows) : console.log(err);
  });
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