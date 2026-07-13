import { useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const Profile = () => {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async () => {
    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.put("/change-password", {
        username: user.username,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert(res.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <Layout>
      <div
        style={{
          maxWidth: "500px",
          margin: "20px auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1976d2",
          }}
        >
          My Profile
        </h1>

        <div
          style={{
            textAlign: "center",
            fontSize: "70px",
            margin: "20px 0",
          }}
        >
          👤
        </div>

        <h3 style={{ textAlign: "center" }}>
          {user.username || "Admin"}
        </h3>

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "25px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={changePassword}
          style={{
            width: "100%",
            padding: "12px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Change Password
        </button>
      </div>
    </Layout>
  );
};

export default Profile;