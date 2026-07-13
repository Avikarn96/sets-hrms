import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaChartBar,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Employees", path: "/employees", icon: <FaUsers /> },
    { name: "Departments", path: "/departments", icon: <FaBuilding /> },
    { name: "Attendance", path: "/attendance", icon: <FaClipboardCheck /> },
    { name: "Leave", path: "/leave", icon: <FaCalendarAlt /> },
    { name: "Payroll", path: "/payroll", icon: <FaMoneyCheckAlt /> },
    { name: "Reports", path: "/reports", icon: <FaChartBar /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
    { name: "Profile", path: "/profile", icon: <FaUserCircle /> },
  ];

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,.15)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 20px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,.15)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: "700",
          }}
        >
          SETS
        </h1>

        <p
          style={{
            marginTop: "6px",
            fontSize: "14px",
            opacity: 0.9,
          }}
        >
          HRMS
        </p>
      </div>

      {/* Menu */}
      <div
        style={{
          flex: 1,
          padding: "20px 15px",
        }}
      >
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                marginBottom: "10px",
                borderRadius: "10px",
                textDecoration: "none",
                color: active ? "#1976d2" : "#fff",
                background: active ? "#fff" : "transparent",
                borderLeft: active
                  ? "5px solid #ffc107"
                  : "5px solid transparent",
                fontWeight: active ? "bold" : "500",
                transition: "all .3s ease",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "18px",
          textAlign: "center",
          fontSize: "12px",
          borderTop: "1px solid rgba(255,255,255,.15)",
          opacity: 0.85,
        }}
      >
        Version 1.0
      </div>
    </div>
  );
};

export default Sidebar;