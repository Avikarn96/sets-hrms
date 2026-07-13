import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Leave = () => {
  const emptyForm = {
    employee_id: "",
    leave_type: "Casual",
    from_date: "",
    to_date: "",
    reason: "",
    status: "Pending",
  };

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
    loadLeaves();
  }, []);

  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const loadLeaves = async () => {
    const res = await api.get("/leaves");
    setLeaves(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveLeave = async () => {
    try {
      if (editingId) {
        const res = await api.put(`/leave/${editingId}`, form);
        alert(res.data.message);
      } else {
        const res = await api.post("/leave", form);
        alert(res.data.message);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadLeaves();
    } catch (err) {
      console.log(err);
      alert("Error saving leave");
    }
  };

  const editLeave = (row) => {
    setEditingId(row.id);

    setForm({
      employee_id: row.employee_id,
      leave_type: row.leave_type,
      from_date: row.from_date,
      to_date: row.to_date,
      reason: row.reason,
      status: row.status,
    });
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete leave record?")) return;

    const res = await api.delete(`/leave/${id}`);
    alert(res.data.message);
    loadLeaves();
  };

  const filteredLeaves = leaves.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1>Leave Management</h1>

      <input
        type="text"
        placeholder="Search Leave..."
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

        <select
          name="leave_type"
          value={form.leave_type}
          onChange={handleChange}
        >
          <option>Casual</option>
          <option>Sick</option>
          <option>Annual</option>
          <option>Emergency</option>
        </select>

        <input
          type="date"
          name="from_date"
          value={form.from_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="to_date"
          value={form.to_date}
          onChange={handleChange}
        />

        <input
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <br />

      <button onClick={saveLeave}>
        {editingId ? "Update Leave" : "Apply Leave"}
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
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeaves.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">
                No Leave Records
              </td>
            </tr>
          ) : (
            filteredLeaves.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.empid} - {row.name}</td>
                <td>{row.leave_type}</td>
                <td>{row.from_date}</td>
                <td>{row.to_date}</td>
                <td>{row.reason}</td>
                <td>{row.status}</td>

                <td>
                  <button onClick={() => editLeave(row)}>Edit</button>

                  <button
                    onClick={() => deleteLeave(row.id)}
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

export default Leave;