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

exports.today_view = function _callee(req, res) {
  var employee_details, dayOfWeek;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Starting controller...');
          _context.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context.sent;
          dayOfWeek = new Date().getDay().toLocaleString("en-UK", {
            timeZone: 'Asia/Kolkata'
          });
          console.log('finishing...'); // RENDERING THE VIEW

          res.render('nonacademic_today', {
            title: 'title',
            employee: employee_details
          });

        case 7:
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

exports.stu_get_profile = function _callee5(req, res) {
  var search_index, search_keyword, employee_details, student, groups, modules, sessions, attendances, sql, degree, deg, bat, batch, id_list, _row, attendanceLoop, present, session_count, percentage, _row2, key;

  return regeneratorRuntime.async(function _callee5$(_context6) {
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
          sql = 'SELECT id,IndexNo,Name,Email,Degree,Batch,Telephone,Address FROM students';

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
            _context6.next = 23;
            break;
          }

          res.status(201).send({
            res: 'No such students'
          });
          return _context6.abrupt("return");

        case 23:
          //RETRIEVING DEGREE OF THE STUDENT
          degree = [student[0].Degree];
          _context6.prev = 24;
          _context6.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, degree));

        case 27:
          deg = _context6.sent;
          student[0].Degree = deg[0].Degree;
          _context6.next = 34;
          break;

        case 31:
          _context6.prev = 31;
          _context6.t1 = _context6["catch"](24);
          console.log('Error : ' + _context6.t1);

        case 34:
          //RETRIEVING Batch OF THE STUDENT
          batch = [student[0].Batch];
          _context6.prev = 35;
          _context6.next = 38;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, batch));

        case 38:
          bat = _context6.sent;
          student[0].Batch = bat[0].Batch;
          _context6.next = 45;
          break;

        case 42:
          _context6.prev = 42;
          _context6.t2 = _context6["catch"](35);
          console.log('Error : ' + _context6.t2);

        case 45:
          _context6.prev = 45;
          _context6.next = 48;
          return regeneratorRuntime.awrap(commonFunctions.getGroupsOfAStudent(conn, student[0].id));

        case 48:
          groups = _context6.sent;
          console.log("Student Groups");
          console.log(groups);
          _context6.next = 56;
          break;

        case 53:
          _context6.prev = 53;
          _context6.t3 = _context6["catch"](45);
          console.log('Error : ' + _context6.t3);

        case 56:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Stu_group);
          }); // RETRIEVING ALL GROUPS RELEVANT TO THE STUDENT

          _context6.prev = 58;
          _context6.next = 61;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, id_list, 1));

        case 61:
          groups = _context6.sent;
          console.log(groups);
          _context6.next = 68;
          break;

        case 65:
          _context6.prev = 65;
          _context6.t4 = _context6["catch"](58);
          console.log('Error : ' + _context6.t4);

        case 68:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.Module);
          }); // RETRIEVING ALL MODULES RELEVANT TO THE STUDENT

          _context6.prev = 70;
          _context6.next = 73;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, id_list));

        case 73:
          modules = _context6.sent;
          console.log(modules);
          _context6.next = 80;
          break;

        case 77:
          _context6.prev = 77;
          _context6.t5 = _context6["catch"](70);
          console.log('Error : ' + _context6.t5);

        case 80:
          id_list = [];
          groups.forEach(function (element) {
            id_list.push(element.id);
          }); // RETRIEVING ALL SESSIONS RELEVANT TO THE GROUPS

          _context6.prev = 82;
          _context6.next = 85;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, id_list, 1));

        case 85:
          sessions = _context6.sent;
          console.log(sessions);
          _context6.next = 92;
          break;

        case 89:
          _context6.prev = 89;
          _context6.t6 = _context6["catch"](82);
          console.log('Error : ' + _context6.t6);

        case 92:
          //RETIEVING ALL ATTENDANCE ROWS OF SELECTED STUDENT RELEVANT TO EACH STUDENT GROUP
          attendances = [];
          _row = [];

          attendanceLoop = function attendanceLoop(_) {
            return regeneratorRuntime.async(function attendanceLoop$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.t0 = regeneratorRuntime.keys(groups);

                  case 1:
                    if ((_context5.t1 = _context5.t0()).done) {
                      _context5.next = 16;
                      break;
                    }

                    grp = _context5.t1.value;
                    _context5.prev = 3;
                    _context5.next = 6;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, groups[grp].id));

                  case 6:
                    _row = _context5.sent;

                    _row.push({
                      group: groups[grp].id
                    }); //console.log(row);


                    attendances.push(_row);
                    _context5.next = 14;
                    break;

                  case 11:
                    _context5.prev = 11;
                    _context5.t2 = _context5["catch"](3);
                    console.log('Error : ' + _context5.t2);

                  case 14:
                    _context5.next = 1;
                    break;

                  case 16:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[3, 11]]);
          };

          _context6.next = 97;
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
          return _context6.stop();
      }
    }
  }, null, null, [[8, 14], [24, 31], [35, 42], [45, 53], [58, 65], [70, 77], [82, 89]]);
}; // RETRIEVE VIEW RELATED TO PAST REPORTS SECTION


exports.past_reports_view = function _callee6(req, res) {
  var employee_details, groups, modules, batches, degrees;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log('Function starting... get_past_reports');
          _context7.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context7.sent;
          _context7.prev = 4;
          _context7.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context7.sent;
          console.log(batches);
          _context7.next = 14;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](4);
          console.log('Error : ' + _context7.t0);

        case 14:
          _context7.prev = 14;
          _context7.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, null));

        case 17:
          modules = _context7.sent;
          console.log(modules);
          _context7.next = 24;
          break;

        case 21:
          _context7.prev = 21;
          _context7.t1 = _context7["catch"](14);
          console.log('Error : ' + _context7.t1);

        case 24:
          _context7.prev = 24;
          _context7.next = 27;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 27:
          degrees = _context7.sent;
          console.log(degrees);
          _context7.next = 34;
          break;

        case 31:
          _context7.prev = 31;
          _context7.t2 = _context7["catch"](24);
          console.log('Error : ' + _context7.t2);

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
          return _context7.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21], [24, 31]]);
}; // RETRIEVE GROUPS RELATED TO THE MODULE SELECTED BY THE USER


exports.past_get_groups = function _callee7(req, res) {
  var module, batch, modules, groups, matchingGroups;
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          module = req.query.module;
          batch = req.query.batch;
          console.log(module);
          modules = [module];
          groups = [];
          _context8.prev = 5;
          _context8.next = 8;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, modules, 2));

        case 8:
          groups = _context8.sent;
          console.log(groups);
          _context8.next = 16;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](5);
          console.log('Error : ' + _context8.t0);
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
          return _context8.stop();
      }
    }
  }, null, null, [[5, 12]]);
}; // RETRIEVE SESSIONS ACCORDING TO THE GIVEN BATCH, MODULE AND GROUP


exports.past_get_sessions = function _callee8(req, res) {
  var group, groups, sessions;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          group = req.query.group;
          groups = [group];
          _context9.prev = 2;
          _context9.next = 5;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, groups, 1));

        case 5:
          sessions = _context9.sent;
          console.log(sessions);
          _context9.next = 13;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](2);
          console.log('Error : ' + _context9.t0);
          res.send({
            status: '500',
            sessions: sessions
          });

        case 13:
          res.send({
            status: '200',
            sessions: sessions
          });

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.past_get_sessionattendance = function _callee9(req, res) {
  var session, attendance, students;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          session = [];
          session.push(req.query.session);
          attendance = [];
          _context10.prev = 3;
          _context10.next = 6;
          return regeneratorRuntime.awrap(commonFunctions.getSessions(conn, session, 2));

        case 6:
          session = _context10.sent;
          console.log(session);
          _context10.next = 14;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](3);
          console.log('Error : ' + _context10.t0);
          res.send({
            status: '500',
            attendance: attendance
          });

        case 14:
          _context10.prev = 14;
          _context10.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getAttendanceofSession(conn, session[0].id, session[0].Ses_group));

        case 17:
          attendance = _context10.sent;
          console.log(attendance);
          _context10.next = 25;
          break;

        case 21:
          _context10.prev = 21;
          _context10.t1 = _context10["catch"](14);
          console.log('Error : ' + _context10.t1);
          res.send({
            status: '500',
            attendance: attendance
          });

        case 25:
          students = [];

          for (student in attendance) {
            students.push([attendance[student].Student]);
          }

          _context10.prev = 27;
          _context10.next = 30;
          return regeneratorRuntime.awrap(commonFunctions.getStudentsFiltered(conn, students, 0));

        case 30:
          students = _context10.sent;
          console.log(students);
          _context10.next = 38;
          break;

        case 34:
          _context10.prev = 34;
          _context10.t2 = _context10["catch"](27);
          console.log('Error : ' + _context10.t2);
          res.send({
            status: '500',
            attendance: attendance
          });

        case 38:
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

        case 40:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[3, 10], [14, 21], [27, 34]]);
}; // GET REQUIRED DETAILS TO LOAD TIME TABLE SCREEN


exports.timetable_view = function _callee10(req, res) {
  var employee_details, degrees, batches;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log('Function starting... get time table');
          _context11.next = 3;
          return regeneratorRuntime.awrap(loadInitialDetails());

        case 3:
          employee_details = _context11.sent;
          _context11.prev = 4;
          _context11.next = 7;
          return regeneratorRuntime.awrap(commonFunctions.getBatchDetails(conn, null));

        case 7:
          batches = _context11.sent;
          console.log(batches);
          _context11.next = 14;
          break;

        case 11:
          _context11.prev = 11;
          _context11.t0 = _context11["catch"](4);
          console.log('Error : ' + _context11.t0);

        case 14:
          _context11.prev = 14;
          _context11.next = 17;
          return regeneratorRuntime.awrap(commonFunctions.getDegreeDetails(conn, null));

        case 17:
          degrees = _context11.sent;
          console.log(degrees);
          _context11.next = 24;
          break;

        case 21:
          _context11.prev = 21;
          _context11.t1 = _context11["catch"](14);
          console.log('Error : ' + _context11.t1);

        case 24:
          res.render('nonacademic_timetable', {
            employee: employee_details,
            batches: batches,
            degrees: degrees
          });

        case 25:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[4, 11], [14, 21]]);
}; // GET LECTURES RELEVANT TO GIVEN DAY, BATCH AND DEGREE


exports.timetable_getlectures = function _callee11(req, res) {
  var day, batch, degree, groups, group_ids, modules, lectures;
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          day = req.query.day;
          batch = [];
          batch.push(req.query.batch);
          degree = req.query.degree;
          console.log(day);
          groups = [];
          _context12.prev = 6;
          _context12.next = 9;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, batch, 3));

        case 9:
          groups = _context12.sent;
          console.log(groups);
          _context12.next = 17;
          break;

        case 13:
          _context12.prev = 13;
          _context12.t0 = _context12["catch"](6);
          console.log('Error : ' + _context12.t0);
          res.send({
            status: '500',
            lectures: []
          });

        case 17:
          group_ids = [], modules = [];

          for (group in groups) {
            group_ids.push(groups[group].id);
          }

          _context12.prev = 19;
          _context12.next = 22;
          return regeneratorRuntime.awrap(commonFunctions.getGroups_DegreeFiltered(conn, degree, group_ids));

        case 22:
          groups = _context12.sent;
          console.log(groups);
          _context12.next = 30;
          break;

        case 26:
          _context12.prev = 26;
          _context12.t1 = _context12["catch"](19);
          console.log('Error : ' + _context12.t1);
          res.send({
            status: '500',
            lectures: []
          });

        case 30:
          group_ids = [];

          for (group in groups) {
            group_ids.push(groups[group].Stu_group);
          }

          lectures = [];
          _context12.prev = 33;
          _context12.next = 36;
          return regeneratorRuntime.awrap(commonFunctions.getTimeTable(conn, day, group_ids));

        case 36:
          lectures = _context12.sent;
          console.log(lectures);
          _context12.next = 44;
          break;

        case 40:
          _context12.prev = 40;
          _context12.t2 = _context12["catch"](33);
          console.log('Error : ' + _context12.t2);
          res.send({
            status: '500',
            lectures: []
          });

        case 44:
          group_ids = [];

          for (lecture in lectures) {
            group_ids.push(lectures[lecture].T_group);
          }

          _context12.prev = 46;
          _context12.next = 49;
          return regeneratorRuntime.awrap(commonFunctions.getStudentGroupDetails(conn, group_ids, 1));

        case 49:
          groups = _context12.sent;
          console.log(groups);
          _context12.next = 57;
          break;

        case 53:
          _context12.prev = 53;
          _context12.t3 = _context12["catch"](46);
          console.log('Error : ' + _context12.t3);
          res.send({
            status: '500',
            lectures: []
          });

        case 57:
          for (group in groups) {
            modules.push(groups[group].Module);
          }

          _context12.prev = 58;
          _context12.next = 61;
          return regeneratorRuntime.awrap(commonFunctions.getModuleDetails(conn, modules));

        case 61:
          modules = _context12.sent;
          console.log(modules);
          _context12.next = 69;
          break;

        case 65:
          _context12.prev = 65;
          _context12.t4 = _context12["catch"](58);
          console.log('Error : ' + _context12.t4);
          res.send({
            status: '500',
            lectures: []
          });

        case 69:
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

        case 71:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[6, 13], [19, 26], [33, 40], [46, 53], [58, 65]]);
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
  return regeneratorRuntime.async(function load_attendance_of_a_student$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          attendances = [];
          row = [];
          groups.forEach(function _callee12(element) {
            return regeneratorRuntime.async(function _callee12$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.prev = 0;
                    _context13.next = 3;
                    return regeneratorRuntime.awrap(commonFunctions.getAttendanceRow(conn, student[0].id, element.id));

                  case 3:
                    row = _context13.sent;
                    row.push({
                      group: element.id
                    });
                    console.log(row);
                    attendances.push(row);
                    _context13.next = 12;
                    break;

                  case 9:
                    _context13.prev = 9;
                    _context13.t0 = _context13["catch"](0);
                    console.log('Error : ' + _context13.t0);

                  case 12:
                  case "end":
                    return _context13.stop();
                }
              }
            }, null, null, [[0, 9]]);
          });

        case 3:
        case "end":
          return _context14.stop();
      }
    }
  });
} // GET EMPLOYEE DETAILS, MATCHING DESIGNATIONS


function loadInitialDetails() {
  var employee_details, designations;
  return regeneratorRuntime.async(function loadInitialDetails$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(getEmployeeDetails(process.env.CURRENT_ID, ['Name', 'Designation']));

        case 3:
          employee_details = _context15.sent;
          _context15.next = 9;
          break;

        case 6:
          _context15.prev = 6;
          _context15.t0 = _context15["catch"](0);
          console.log('Error : ' + _context15.t0);

        case 9:
          _context15.prev = 9;
          _context15.next = 12;
          return regeneratorRuntime.awrap(commonFunctions.getDesignations(conn));

        case 12:
          designations = _context15.sent;
          _context15.next = 18;
          break;

        case 15:
          _context15.prev = 15;
          _context15.t1 = _context15["catch"](9);
          console.log('Error : ' + _context15.t1);

        case 18:
          // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
          designations.forEach(function (element) {
            if (element.id == employee_details[0].Designation) {
              employee_details[0].Designation = element.Name;
              return;
            }
          });
          return _context15.abrupt("return", employee_details);

        case 20:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 6], [9, 15]]);
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