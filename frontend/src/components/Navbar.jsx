import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  let user = null;

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
    console.log("Invalid user in localStorage");
  }

  const logout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "240px",
        right: 0,
        height: "100px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 35px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div>
        <h1
          style={{
            margin: 0,
            color: "#1976d2",
            fontSize: "34px",
            fontWeight: "700",
          }}
        >
          SETS HRMS
        </h1>

        <p
          style={{
            margin: 0,
            color: "#777",
            fontSize: "13px",
          }}
        >
          Human Resource Management System
        </p>
      </div>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            background: "#1976d2",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          👤
        </div>

        {/* Welcome */}
        <div>
          <div
            style={{
              fontSize: "13px",
              color: "#666",
            }}
          >
            Welcome Back
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#222",
            }}
          >
            {user?.username || "Admin"}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          onMouseEnter={(e) => {
            e.target.style.background = "#b71c1c";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#e53935";
          }}
          style={{
            marginLeft: "15px",
            background: "#e53935",
            color: "#fff",
            border: "none",
            padding: "11px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            transition: "0.3s",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;