import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    if (!login.username || !login.password) {
      toast.warning("Please enter Username and Password");
      return;
    }

    try {
      const res = await api.post("/login", login);

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login Successful");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1976d2,#42a5f5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "60px",
          }}
        >
          👨‍💼
        </div>

        <h1
          style={{
            textAlign: "center",
            color: "#1976d2",
            marginBottom: "5px",
          }}
        >
          SETS HRMS
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Human Resource Management System
        </p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={login.username}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={login.password}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={loginUser}
          style={{
            width: "100%",
            padding: "12px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          LOGIN
        </button>

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}
        >
          <strong>Demo Login</strong>
          <br />
          Username: <strong>admin</strong>
          <br />
          Password: <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
};

export default Login;