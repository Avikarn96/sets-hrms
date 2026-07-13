import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

function Departments() {
  const emptyForm = {
    department_name: "",
    department_code: "",
    hod: "",
    description: "",
  };

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load departments");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveDepartment = async () => {
    if (!form.department_name || !form.department_code) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/department/${editingId}`, form);
        alert(res.data.message);
      } else {
        const res = await api.post("/department", form);
        alert(res.data.message);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadDepartments();
    } catch (err) {
      console.error(err);
      alert("Error saving department.");
    }
  };

  const editDepartment = (dept) => {
    setEditingId(dept.id);

    setForm({
      department_name: dept.department_name,
      department_code: dept.department_code,
      hod: dept.hod,
      description: dept.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      const res = await api.delete(`/department/${id}`);
      alert(res.data.message);
      loadDepartments();
    } catch (err) {
      console.error(err);
      alert("Unable to delete department.");
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const filteredDepartments = departments.filter((dept) =>
    Object.values(dept)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1>Department Management</h1>

      <input
        type="text"
        placeholder="Search Department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 20,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
       <input
  name="department_name"
  placeholder="Department Name"
  value={form.department_name}
  onChange={handleChange}
  required
/>

       <input
  name="department_code"
  placeholder="Department Code"
  value={form.department_code}
  onChange={handleChange}
  required
/>

        <input
          name="hod"
          placeholder="Head of Department"
          value={form.hod}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={saveDepartment}
        style={{
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {editingId ? "Update Department" : "Add Department"}
      </button>

      <button
        onClick={clearForm}
        style={{
          marginLeft: 10,
          padding: "10px 20px",
          background: "#666",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Clear
      </button>

      <hr style={{ margin: "30px 0" }} />

      <table
        border="1"
        cellPadding="10"
        width="100%"
        style={{
          borderCollapse: "collapse",
          background: "white",
        }}
      >
        <thead
  style={{
    background: "#1976d2",
    color: "white",
    textAlign: "left",
  }}
>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Department Code</th>
            <th>HOD</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredDepartments.length === 0 ? (
            <tr>
              <td colSpan="6" align="center">
                No Departments Found
              </td>
            </tr>
          ) : (
            filteredDepartments.map((dept) => (
              <tr
  key={dept.id}
  style={{
    background: dept.id % 2 === 0 ? "#fafafa" : "#fff",
  }}
>
                <td>{dept.id}</td>
                <td>{dept.department_name}</td>
                <td>{dept.department_code}</td>
                <td>{dept.hod}</td>
                <td>{dept.description}</td>

                <td
  style={{
    whiteSpace: "nowrap",
  }}
>
                  <button
                    onClick={() => editDepartment(dept)}
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDepartment(dept.id)}
                    style={{
                      marginLeft: 8,
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
}

export default Departments;