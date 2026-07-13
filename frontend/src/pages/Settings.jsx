import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Settings = () => {
  return (
    <Layout>
      <h1>Settings</h1>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          maxWidth: "700px",
        }}
      >
        <h2 style={{ color: "#1976d2" }}>HRMS Settings</h2>

        <hr />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            🏢 <strong>Company Name</strong>
            <br />
            <span style={{ color: "#666" }}>
              SETS Human Resource Management System
            </span>
          </div>

          <div
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            👤 <strong>Admin Profile</strong>
            <br />
            <span style={{ color: "#666" }}>
              Manage your administrator account.
            </span>
          </div>

          <Link
            to="/profile"
            style={{
              padding: "12px",
              border: "1px solid #1976d2",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            🔑 Change Password
          </Link>

          <div
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            ⚙ <strong>System Preferences</strong>
            <br />
            <span style={{ color: "#666" }}>
              Configure application settings.
            </span>
          </div>

          <div
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            💾 <strong>Backup & Restore</strong>
            <br />
            <span style={{ color: "#666" }}>
              Backup or restore HRMS database.
            </span>
          </div>
        </div>

        <button
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Settings
        </button>
      </div>
    </Layout>
  );
};

export default Settings;