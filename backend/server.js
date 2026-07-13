const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================

const db = new sqlite3.Database("./sets_hrms.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Database Connected");
  }
});

// ================= TABLES =================

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS admins(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empid TEXT,
      name TEXT,
      department TEXT,
      designation TEXT,
      phone TEXT,
      email TEXT,
      salary REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS departments(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_name TEXT,
      department_code TEXT,
      hod TEXT,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS attendance(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      attendance_date TEXT,
      login_time TEXT,
      logout_time TEXT,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leaves(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      from_date TEXT,
      to_date TEXT,
      reason TEXT,
      status TEXT
    )
  `);

  db.run(`
CREATE TABLE IF NOT EXISTS payroll(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    month TEXT,
    basic_salary REAL,
    allowance REAL,
    deduction REAL,
    net_salary REAL
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
)
`);

db.get(
    "SELECT * FROM users WHERE username=?",
    ["admin"],
    (err, row) => {
        if (!row) {
            db.run(
                "INSERT INTO users(username,password,role) VALUES(?,?,?)",
                ["admin", "admin123", "Admin"]
            );
        }
    }
);

  db.get(
    "SELECT * FROM admins WHERE username=?",
    ["admin"],
    async (err, row) => {

      if (err) return console.log(err);

      if (!row) {

        const hash = await bcrypt.hash("admin123", 10);

        db.run(
          "INSERT INTO admins(username,password) VALUES(?,?)",
          ["admin", hash]
        );

        console.log("Default Admin Created");
      }
    }
  );

});

// ================= HOME =================

app.get("/", (req, res) => {

  res.json({
    company: "Srishti Eco Tech Solutions",
    project: "SETS HRMS",
    status: "Running"
  });

});

// ================= LOGIN =================

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM admins WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (!user) {
        return res.json({
          success: false,
          message: "Invalid Username",
        });
      }

      try {
        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
          return res.json({
            success: false,
            message: "Wrong Password",
          });
        }

        return res.json({
          success: true,
          message: "Login Successful",
          user: {
            id: user.id,
            username: user.username,
          },
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  );
});

// ================= ADD EMPLOYEE =================

app.post("/employee", (req, res) => {

  const {
    empid,
    name,
    department,
    designation,
    phone,
    email,
    salary
  } = req.body;

  db.run(
    `INSERT INTO employees
    (empid,name,department,designation,phone,email,salary)
    VALUES(?,?,?,?,?,?,?)`,
    [
      empid,
      name,
      department,
      designation,
      phone,
      email,
      salary
    ],
    function(err){

      if (err) {
  console.log("SQL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message
  });
}

      res.json({
        success:true,
        message:"Employee Added Successfully",
        id:this.lastID
      });

    }
  );

});

// ================= GET EMPLOYEES =================

app.get("/employees",(req,res)=>{

  db.all(
    "SELECT * FROM employees ORDER BY id DESC",
    [],
    (err,rows)=>{

      if (err) {
  console.log("SQL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message
  });
}

      res.json(rows);

    }
  );

});

// ================= GET SINGLE EMPLOYEE =================

app.get("/employee/:id", (req, res) => {

  db.get(
    "SELECT * FROM employees WHERE id=?",
    [req.params.id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(row);

    }
  );

});

// ================= UPDATE EMPLOYEE =================

app.put("/employee/:id", (req, res) => {

  const {
    empid,
    name,
    department,
    designation,
    phone,
    email,
    salary,
  } = req.body;

  db.run(
    `UPDATE employees
     SET
        empid=?,
        name=?,
        department=?,
        designation=?,
        phone=?,
        email=?,
        salary=?
     WHERE id=?`,
    [
      empid,
      name,
      department,
      designation,
      phone,
      email,
      salary,
      req.params.id,
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Employee Updated Successfully",
      });

    }
  );

});

// ================= DELETE EMPLOYEE =================

app.delete("/employee/:id", (req, res) => {

  db.run(
    "DELETE FROM employees WHERE id=?",
    [req.params.id],
    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Employee Deleted Successfully",
      });

    }
  );

});

// ================= ADD DEPARTMENT =================

app.post("/department", (req, res) => {

  const {
    department_name,
    department_code,
    hod,
    description,
  } = req.body;

  db.run(
    `INSERT INTO departments
    (department_name,department_code,hod,description)
    VALUES(?,?,?,?)`,
    [
      department_name,
      department_code,
      hod,
      description,
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Department Added Successfully",
        id: this.lastID,
      });

    }
  );

});

// ================= GET ALL DEPARTMENTS =================

app.get("/departments", (req, res) => {

  db.all(
    "SELECT * FROM departments ORDER BY id DESC",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(rows);

    }
  );

});

// ================= GET SINGLE DEPARTMENT =================

app.get("/department/:id", (req, res) => {

  db.get(
    "SELECT * FROM departments WHERE id=?",
    [req.params.id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(row);

    }
  );

});

// ================= UPDATE DEPARTMENT =================

app.put("/department/:id", (req, res) => {

  const {
    department_name,
    department_code,
    hod,
    description,
  } = req.body;

  db.run(
    `UPDATE departments
     SET
        department_name=?,
        department_code=?,
        hod=?,
        description=?
     WHERE id=?`,
    [
      department_name,
      department_code,
      hod,
      description,
      req.params.id,
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Department Updated Successfully",
      });

    }
  );

});

// ================= DELETE DEPARTMENT =================

app.delete("/department/:id", (req, res) => {

  db.run(
    "DELETE FROM departments WHERE id=?",
    [req.params.id],
    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Department Deleted Successfully",
      });

    }
  );

});

// ================= GET ALL ATTENDANCE =================

app.get("/attendance", (req, res) => {

    const sql = `
        SELECT
            attendance.id,
            attendance.employee_id,
            employees.name AS employee_name,
            attendance.date,
            attendance.login_time,
            attendance.logout_time,
            attendance.status
        FROM attendance
        LEFT JOIN employees
        ON attendance.employee_id = employees.id
        ORDER BY attendance.date DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);

    });

});


// ================= GET ATTENDANCE BY ID =================

app.get("/attendance/:id", (req, res) => {

    db.get(
        `
        SELECT
            attendance.id,
            attendance.employee_id,
            employees.name AS employee_name,
            attendance.date,
            attendance.login_time,
            attendance.logout_time,
            attendance.status
        FROM attendance
        LEFT JOIN employees
        ON attendance.employee_id = employees.id
        WHERE attendance.id=?
        `,
        [req.params.id],

        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(row);

        }

    );

});


// ================= GET SINGLE ATTENDANCE =================

app.get("/attendance/:id", (req, res) => {
  db.get(
    "SELECT * FROM attendance WHERE id=?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(row);
    }
  );
});


// ================= ADD ATTENDANCE =================

app.post("/attendance", (req, res) => {

    const {
        employee_id,
        attendance_date,
        login_time,
        logout_time,
        status
    } = req.body;

    db.run(
        `
        INSERT INTO attendance
        (
            employee_id,
            date,
            login_time,
            logout_time,
            status
        )
        VALUES (?,?,?,?,?)
        `,
        [
            employee_id,
            attendance_date,
            login_time || "",
            logout_time || "",
            status
        ],

        function(err){

            if(err){

                console.log(err);

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({
                success:true,
                message:"Attendance Added Successfully",
                id:this.lastID
            });

        }

    );

});


// ================= UPDATE ATTENDANCE =================

app.put("/attendance/:id", (req,res)=>{

    const {
        employee_id,
        attendance_date,
        login_time,
        logout_time,
        status
    } = req.body;

    db.run(
        `
        UPDATE attendance
        SET
            employee_id=?,
            date=?,
            login_time=?,
            logout_time=?,
            status=?
        WHERE id=?
        `,
        [
            employee_id,
            attendance_date,
            login_time || "",
            logout_time || "",
            status,
            req.params.id
        ],

        function(err){

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({
                success:true,
                message:"Attendance Updated Successfully"
            });

        }

    );

});


// ================= DELETE ATTENDANCE =================

app.delete("/attendance/:id",(req,res)=>{

    db.run(
        "DELETE FROM attendance WHERE id=?",
        [req.params.id],

        function(err){

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({
                success:true,
                message:"Attendance Deleted Successfully"
            });

        }

    );

});

// ================= GET ALL LEAVES =================

app.get("/leaves", (req, res) => {
  db.all(
    `SELECT leaves.*,
            employees.name,
            employees.empid
     FROM leaves
     LEFT JOIN employees
     ON leaves.employee_id = employees.id
     ORDER BY leaves.id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(rows);
    }
  );
});

// ================= GET SINGLE LEAVE =================

app.get("/leave/:id", (req, res) => {
  db.get(
    "SELECT * FROM leaves WHERE id=?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(row);
    }
  );
});

// ================= ADD LEAVE =================

app.post("/leave", (req, res) => {
  const {
    employee_id,
    from_date,
    to_date,
    reason,
    status,
  } = req.body;

  db.run(
    `INSERT INTO leaves
    (employee_id,from_date,to_date,reason,status)
    VALUES(?,?,?,?,?)`,
    [
      employee_id,
      from_date,
      to_date,
      reason,
      status,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Leave Added Successfully",
        id: this.lastID,
      });
    }
  );
});

// ================= UPDATE LEAVE =================

app.put("/leave/:id", (req, res) => {
  const {
    employee_id,
    from_date,
    to_date,
    reason,
    status,
  } = req.body;

  db.run(
    `UPDATE leaves
     SET employee_id=?,
         from_date=?,
         to_date=?,
         reason=?,
         status=?
     WHERE id=?`,
    [
      employee_id,
      from_date,
      to_date,
      reason,
      status,
      req.params.id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Leave Updated Successfully",
      });
    }
  );
});

// ================= DELETE LEAVE =================

app.delete("/leave/:id", (req, res) => {
  db.run(
    "DELETE FROM leaves WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Leave Deleted Successfully",
      });
    }
  );
});

// ================= GET ALL PAYROLL =================

app.get("/payroll", (req, res) => {
  db.all(
    `SELECT payroll.*,
            employees.name,
            employees.empid
     FROM payroll
     LEFT JOIN employees
     ON payroll.employee_id = employees.id
     ORDER BY payroll.id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(rows);
    }
  );
});

// ================= ADD PAYROLL =================

app.post("/payroll", (req, res) => {

  const {
    employee_id,
    month,
    basic_salary,
    allowance,
    deduction,
    net_salary
  } = req.body;

  db.run(
    `INSERT INTO payroll
    (employee_id,month,basic_salary,allowance,deduction,net_salary)
    VALUES(?,?,?,?,?,?)`,
    [
      employee_id,
      month,
      basic_salary,
      allowance,
      deduction,
      net_salary
    ],
    function(err){

      if (err) {
  console.log("SQL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message
  });
}

      res.json({
        success:true,
        message:"Payroll Added Successfully"
      });

    }
  );

});

// ================= UPDATE PAYROLL =================

app.put("/payroll/:id",(req,res)=>{

  const{
    employee_id,
    month,
    basic_salary,
    allowance,
    deduction,
    net_salary
  }=req.body;

  db.run(
    `UPDATE payroll
     SET employee_id=?,
         month=?,
         basic_salary=?,
         allowance=?,
         deduction=?,
         net_salary=?
     WHERE id=?`,
    [
      employee_id,
      month,
      basic_salary,
      allowance,
      deduction,
      net_salary,
      req.params.id
    ],
    function(err){

      if (err) {
  console.log("SQL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message
  });
}

      res.json({
        success:true,
        message:"Payroll Updated Successfully"
      });

    }
  );

});

// ================= DELETE PAYROLL =================

app.delete("/payroll/:id",(req,res)=>{

  db.run(
    "DELETE FROM payroll WHERE id=?",
    [req.params.id],
    function(err){

      if (err) {
  console.log("SQL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message
  });
}

      res.json({
        success:true,
        message:"Payroll Deleted Successfully"
      });

    }
  );

});

// ================= DASHBOARD STATS =================

app.get("/dashboard", (req, res) => {

  db.get("SELECT COUNT(*) AS totalEmployees FROM employees", [], (err, emp) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    db.get("SELECT COUNT(*) AS totalDepartments FROM departments", [], (err, dept) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      db.get("SELECT COUNT(*) AS totalAttendance FROM attendance", [], (err, attendance) => {

        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        db.get("SELECT COUNT(*) AS totalLeaves FROM leaves", [], (err, leave) => {

          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message
            });
          }

          db.get("SELECT COUNT(*) AS totalPayroll FROM payroll", [], (err, payroll) => {

            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message
              });
            }

            res.json({
              employees: emp.totalEmployees,
              departments: dept.totalDepartments,
              attendance: attendance.totalAttendance,
              leaves: leave.totalLeaves,
              payroll: payroll.totalPayroll
            });

          });

        });

      });

    });

  });

});

// ================= REPORTS =================

// Employee Report
app.get("/reports/employees", (req, res) => {
  db.all("SELECT * FROM employees ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.json(rows);
  });
});

// Department Report
app.get("/reports/departments", (req, res) => {
  db.all("SELECT * FROM departments ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.json(rows);
  });
});

// Attendance Report
app.get("/reports/attendance", (req, res) => {
  db.all(
    `SELECT attendance.*, employees.name, employees.empid
     FROM attendance
     LEFT JOIN employees
     ON attendance.employee_id = employees.id
     ORDER BY attendance.id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      res.json(rows);
    }
  );
});

// Leave Report
app.get("/reports/leaves", (req, res) => {
  db.all(
    `SELECT leaves.*, employees.name, employees.empid
     FROM leaves
     LEFT JOIN employees
     ON leaves.employee_id = employees.id
     ORDER BY leaves.id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      res.json(rows);
    }
  );
});

// Payroll Report
app.get("/reports/payroll", (req, res) => {
  db.all(
    `SELECT payroll.*, employees.name, employees.empid
     FROM payroll
     LEFT JOIN employees
     ON payroll.employee_id = employees.id
     ORDER BY payroll.id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      res.json(rows);
    }
  );
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!row) {
                return res.json({
                    success: false,
                    message: "Invalid Username or Password"
                });
            }

            res.json({
                success: true,
                message: "Login Successful",
                user: row
            });

        }
    );

});

// ================= CHANGE PASSWORD =================

app.put("/change-password", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  db.get(
    "SELECT * FROM admins WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      try {
        const passwordMatch = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!passwordMatch) {
          return res.json({
            success: false,
            message: "Current password is incorrect",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.run(
          "UPDATE admins SET password = ? WHERE username = ?",
          [hashedPassword, username],
          function (err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            return res.json({
              success: true,
              message: "Password changed successfully",
            });
          }
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log("SETS HRMS SERVER STARTED");
  console.log(`Server running on port ${PORT}`);
  console.log("====================================");
});