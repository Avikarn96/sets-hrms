import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Attendance = () => {
  const emptyForm = {
    employee_id: "",
    attendance_date: "",
    status: "Present",
  };

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
    loadAttendance();
  }, []);

  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const loadAttendance = async () => {
    const res = await api.get("/attendance");
    setAttendance(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAttendance = async () => {
    try {
      if (editingId) {
        const res = await api.put(`/attendance/${editingId}`, form);
        alert(res.data.message);
      } else {
        const res = await api.post("/attendance", form);
        alert(res.data.message);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadAttendance();
    } catch (err) {
      console.log(err);
      alert("Error saving attendance");
    }
  };

  const editAttendance = (row) => {
    setEditingId(row.id);

    setForm({
      employee_id: row.employee_id,
      attendance_date: row.attendance_date,
      status: row.status,
    });
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete attendance record?")) return;

    const res = await api.delete(`/attendance/${id}`);
    alert(res.data.message);
    loadAttendance();
  };

  const filteredAttendance = attendance.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1>Attendance Management</h1>

      <input
        type="text"
        placeholder="Search Attendance..."
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
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        <select
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
        >
          <option value="">Select Employee</option>

          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.empid} - {emp.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="attendance_date"
          value={form.attendance_date}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Leave</option>
        </select>
      </div>

      <br />

      <button onClick={saveAttendance}>
        {editingId ? "Update Attendance" : "Add Attendance"}
      </button>

      <hr />

      <table
        border="1"
        cellPadding="8"
        width="100%"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAttendance.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No Attendance Records
              </td>
            </tr>
          ) : (
            filteredAttendance.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.empid} - {row.name}</td>
                <td>{row.attendance_date}</td>
                <td>{row.status}</td>

                <td>
                  <button onClick={() => editAttendance(row)}>
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAttendance(row.id)}
                    style={{ marginLeft: 5 }}
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
};

export default Attendance;