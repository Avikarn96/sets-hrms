import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

import {
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaUserPlus,
  FaFileExport,
  FaUserClock,
  FaCog,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    attendance: 0,
    leaves: 0,
    payroll: 0,
  });

  // Get logged-in user safely
  let user = { username: "Admin" };

  try {
    const storedUser = localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null"
    ) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.log("Invalid user data");
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [emp, dept, attendance, leave, payroll] =
        await Promise.all([
          api.get("/employees"),
          api.get("/departments"),
          api.get("/attendance"),
          api.get("/leaves"),
          api.get("/payroll"),
        ]);

      setStats({
        employees: emp.data.length,
        departments: dept.data.length,
        attendance: attendance.data.length,
        leaves: leave.data.length,
        payroll: payroll.data.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    {
      title: "Employees",
      value: stats.employees,
      icon: <FaUsers />,
      color: "#1976d2",
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: <FaBuilding />,
      color: "#2e7d32",
    },
    {
      title: "Attendance",
      value: stats.attendance,
      icon: <FaClipboardCheck />,
      color: "#ed6c02",
    },
    {
      title: "Leave Records",
      value: stats.leaves,
      icon: <FaCalendarAlt />,
      color: "#8e24aa",
    },
    {
      title: "Payroll",
      value: stats.payroll,
      icon: <FaMoneyCheckAlt />,
      color: "#00897b",
    },
  ];

  const quickActions = [
    {
      title: "Add Employee",
      icon: <FaUserPlus />,
      path: "/employees",
    },
    {
      title: "Attendance",
      icon: <FaUserClock />,
      path: "/attendance",
    },
    {
      title: "Reports",
      icon: <FaFileExport />,
      path: "/reports",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 12px rgba(0,0,0,.12)",
    transition: ".3s",
    cursor: "pointer",
  };

  const sectionStyle = {
    marginTop: "35px",
    background: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 5px 12px rgba(0,0,0,.12)",
  };

  return (
        <Layout>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            margin: 0,
            color: "#1976d2",
            fontSize: "38px",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "#555",
            fontSize: "18px",
          }}
        >
          👋 Welcome back, <b>{user?.username || "Admin"}</b>
        </p>

        <p
          style={{
            color: "#888",
            marginTop: "5px",
          }}
        >
          {today}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              ...cardStyle,
              borderLeft: `6px solid ${card.color}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 12px 25px rgba(0,0,0,.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 5px 12px rgba(0,0,0,.12)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    color: card.color,
                    fontSize: "40px",
                  }}
                >
                  {card.value}
                </h1>

                <p
                  style={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  {card.title}
                </p>
              </div>

              <div
                style={{
                  fontSize: "45px",
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome */}
      <div style={sectionStyle}>
        <h2 style={{ color: "#1976d2" }}>
          Welcome to SETS HRMS
        </h2>

        <p
          style={{
            lineHeight: "30px",
            color: "#555",
          }}
        >
          Manage employees, departments, attendance, leave,
          payroll and reports from one centralized dashboard.
        </p>
      </div>
            {/* Quick Actions */}
      <div style={sectionStyle}>
        <h2 style={{ color: "#1976d2" }}>
          Quick Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {quickActions.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              style={{
                padding: "22px",
                border: "none",
                borderRadius: "12px",
                background: "#1976d2",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "0.3s",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "12px",
                }}
              >
                {item.icon}
              </div>

              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div style={sectionStyle}>
        <h2 style={{ color: "#1976d2" }}>
          System Information
        </h2>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td><b>Application</b></td>
              <td>SETS HRMS</td>
            </tr>

            <tr>
              <td><b>Version</b></td>
              <td>1.0</td>
            </tr>

            <tr>
              <td><b>Frontend</b></td>
              <td>React + Vite</td>
            </tr>

            <tr>
              <td><b>Backend</b></td>
              <td>Node.js + Express</td>
            </tr>

            <tr>
              <td><b>Database</b></td>
              <td>SQLite</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      <div style={sectionStyle}>
        <h2 style={{ color: "#1976d2" }}>
          Recent Activity
        </h2>

        <ul
          style={{
            lineHeight: "35px",
            color: "#555",
          }}
        >
          <li>✅ Employee module is active</li>
          <li>✅ Department module is active</li>
          <li>✅ Attendance module is active</li>
          <li>✅ Leave management is active</li>
          <li>✅ Payroll management is active</li>
          <li>✅ Reports available for export</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Dashboard;