import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Payroll = () => {
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [search, setSearch] = useState("");

  const emptyForm = {
    employee_id: "",
    month: "",
    basic_salary: "",
    allowance: "",
    deduction: "",
    net_salary: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEmployees();
    loadPayroll();
  }, []);

  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const loadPayroll = async () => {
    const res = await api.get("/payroll");
    setPayroll(res.data);
  };

  const handleChange = (e) => {
    const updated = {
      ...form,
      [e.target.name]: e.target.value,
    };

    const basic = Number(updated.basic_salary || 0);
    const allowance = Number(updated.allowance || 0);
    const deduction = Number(updated.deduction || 0);

    updated.net_salary = basic + allowance - deduction;

    setForm(updated);
  };

  const savePayroll = async () => {
    try {
      if (editingId) {
        const res = await api.put(`/payroll/${editingId}`, form);
        alert(res.data.message);
      } else {
        const res = await api.post("/payroll", form);
        alert(res.data.message);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadPayroll();
    } catch (err) {
      console.log(err);
      alert("Error saving payroll");
    }
  };

  const editPayroll = (row) => {
    setEditingId(row.id);

    setForm({
      employee_id: row.employee_id,
      month: row.month,
      basic_salary: row.basic_salary,
      allowance: row.allowance,
      deduction: row.deduction,
      net_salary: row.net_salary,
    });
  };

  const deletePayroll = async (id) => {
    if (!window.confirm("Delete Payroll?")) return;

    const res = await api.delete(`/payroll/${id}`);
    alert(res.data.message);
    loadPayroll();
  };

  const clearForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const filteredPayroll = payroll.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1>Payroll Management</h1>

      <input
        type="text"
        placeholder="Search Payroll..."
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

        <input
          type="month"
          name="month"
          value={form.month}
          onChange={handleChange}
        />

        <input
          name="basic_salary"
          placeholder="Basic Salary"
          value={form.basic_salary}
          onChange={handleChange}
        />

        <input
          name="allowance"
          placeholder="Allowance"
          value={form.allowance}
          onChange={handleChange}
        />

        <input
          name="deduction"
          placeholder="Deduction"
          value={form.deduction}
          onChange={handleChange}
        />

        <input
          name="net_salary"
          placeholder="Net Salary"
          value={form.net_salary}
          readOnly
        />
      </div>

      <br />

      <button onClick={savePayroll}>
        {editingId ? "Update Payroll" : "Add Payroll"}
      </button>

      <button onClick={clearForm} style={{ marginLeft: 10 }}>
        Clear
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
            <th>Month</th>
            <th>Basic</th>
            <th>Allowance</th>
            <th>Deduction</th>
            <th>Net Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayroll.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">
                No Payroll Records
              </td>
            </tr>
          ) : (
            filteredPayroll.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.empid} - {row.name}</td>
                <td>{row.month}</td>
                <td>{row.basic_salary}</td>
                <td>{row.allowance}</td>
                <td>{row.deduction}</td>
                <td>{row.net_salary}</td>

                <td>
                  <button onClick={() => editPayroll(row)}>Edit</button>

                  <button
                    onClick={() => deletePayroll(row.id)}
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

export default Payroll;