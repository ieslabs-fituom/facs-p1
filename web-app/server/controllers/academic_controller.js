const mysql = require('mysql2');
const commonFunctions = require('./common_functions');

// MYSQL CONNECTION (CHANGE .env FILE WHEN TESTING. DON'T EDIT THESE PARAMETERS)
let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_TOKEN,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

exports.view = async (req, res) => {
    console.log('Starting controller...');
    var employee_details, designations, groups_of_employee, modules = [], batches = [];
    var ava_in_array, ava_in_array_2;

    // RETRIEVING ID AND THE DESIGNATION OF THE EMPLOYEE
    try{
        employee_details = await getEmployeeDetails(process.env.CURRENT_ID,['Name','Designation']);
        console.log(employee_details);
    }catch(e){
        console.log('Error : ' + e);
    }
    
    // RETRIEVING ALL DESIGNATIONS
    try{
        designations = await commonFunctions.getDesignations(conn);
        console.log(designations);
    }catch(e){
        console.log('Error : ' + e);
    }

    // MATCHING DESTINATION OF THE EMPLOYEE WITH THE DESIGNATION LIST
    designations.forEach(element => {
        if(element.id == employee_details[0].Designation){
            employee_details[0].Designation = element.Name;
            return;
        }
    })

    // RETREIVING GROUPS OF EMPLOYEE
    try{
        groups_of_employee = await commonFunctions.getGroupsofEmployee(conn,process.env.CURRENT_ID);
        console.log(groups_of_employee);
    }catch(e){
        console.log('Error : ' + e);
    }

    // RETRIEVING DETAILS OF LOADED GROUPS
    try{
        groups_of_employee = await commonFunctions.getStudenGroupDetails(conn,groups_of_employee);
        console.log(groups_of_employee);
    }catch(e){
        console.log('Error : ' + e);
    }

    // REMOVING DUPLICATE MODULES AND BATCHES FROM STUDENT_GROUP LIST
    groups_of_employee.forEach(element => {
        ava_in_array = false;
        ava_in_array_2 = false;
        modules.forEach(element2 => {
            if(element2 == element.Module){
                ava_in_array = true;
                return;
            }
        })
        batches.forEach(element3 => {
            if(element3 == element.Batch){
                ava_in_array_2 = true;
                return;
            }
        })
        if(!ava_in_array){
            modules.push(element.Module);
        }
        if(!ava_in_array_2){
            batches.push(element.Batch);
        }
    })

    // LOADING DETAILS OF THE MODULE
    try{
        modules = await commonFunctions.getModuleDetails(conn,modules);
        console.log(modules);
    }catch(e){
        console.log('Error : ' + e);
    }

    // LOADING DETAILS OF BATCHES
    try{
        batches = await commonFunctions.getBatchDetails(conn,batches);
        console.log(batches);
    }catch(e){
        console.log('Error : ' + e);
    }

    console.log('finishing...');

    // RENDERING THE VIEW
    res.render('sample_view_2', { title: 'title', employee: employee_details, modules: modules, batches: batches, groups: groups_of_employee });
}

exports.get_dept = (req, res) => {
    console.log('Function accessed...');
    conn.query('SELECT * FROM departments WHERE Faculty = ' + req.params.fac, (err, rows) => {
        (!err) ? console.log(rows) : console.log(err);
    });
}

// GET DETAILS OF THE EMPLYEE ( PARAMS : ID OF THE EMPLOYEE, COLUMNS : COLUMNS WHICH ARE NEED TO BE RETRIEVED)
function getEmployeeDetails(id,columns){
    let sql = 'SELECT ';
    columns.forEach(element => {
        sql = sql + element + ',';
    });
    sql = sql.substring(0,sql.length-1);
    sql += ' FROM employees WHERE id=' + id;
    return new Promise((resolve,reject) => {
        conn.query(sql, (err, rows) => {
            if (!err) {
                return resolve(rows);
            } else {
                return reject(err);
            }
        });
    });
}

