import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Employees = () => {

  const emptyForm = {
    empid: "",
    name: "",
    department: "",
    designation: "",
    phone: "",
    email: "",
    salary: "",
  };

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  // ==========================
  // LOAD EMPLOYEES
  // ==========================
  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // LOAD DEPARTMENTS
  // ==========================
  const loadDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // SAVE EMPLOYEE
  // ==========================
  const saveEmployee = async () => {
    try {

      if (editingId) {
        const res = await api.put(`/employee/${editingId}`, form);
        alert(res.data.message);
      } else {
        const res = await api.post("/employee", form);
        alert(res.data.message);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadEmployees();

    } catch (err) {
      console.log(err);
      alert("Error saving employee");
    }
  };

  // ==========================
  // EDIT EMPLOYEE
  // ==========================
  const editEmployee = (emp) => {

    setEditingId(emp.id);

    setForm({
      empid: emp.empid,
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      phone: emp.phone,
      email: emp.email,
      salary: emp.salary,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // ==========================
  // DELETE EMPLOYEE
  // ==========================
  const deleteEmployee = async (id) => {

    if (!window.confirm("Delete Employee?")) return;

    try {

      const res = await api.delete(`/employee/${id}`);

      alert(res.data.message);

      loadEmployees();

    } catch (err) {
      console.log(err);
    }

  };

  // ==========================
  // CLEAR FORM
  // ==========================
  const clearForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // ==========================
  // SEARCH FILTER
  // ==========================
  const filteredEmployees = employees.filter((emp) =>
    Object.values(emp)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <Layout>

      <h1>Employee Management</h1>

      <input
        type="text"
        placeholder="Search Employee..."
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

        <input
          name="empid"
          placeholder="Employee ID"
          value={form.empid}
          onChange={handleChange}
        />

        <input
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
        />

        {/* Department Dropdown + Manual Entry */}
        <input
          list="departmentList"
          name="department"
          placeholder="Select or Type Department"
          value={form.department}
          onChange={handleChange}
        />

        <datalist id="departmentList">
          {departments.map((dept) => (
            <option
              key={dept.id}
              value={dept.department_name}
            />
          ))}
        </datalist>

        <input
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />

      </div>

      <br />

      <button
        onClick={saveEmployee}
        style={{
          background: "#1976d2",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        {editingId ? "Update Employee" : "Add Employee"}
      </button>

      <button
        onClick={clearForm}
        style={{
          marginLeft: 10,
          background: "#757575",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Clear
      </button>

      <hr />

      <table
        border="1"
        cellPadding="8"
        width="100%"
        style={{
          borderCollapse: "collapse",
          background: "white",
        }}
      >

        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredEmployees.length === 0 ? (

            <tr>
              <td colSpan="9" align="center">
                No Employees Found
              </td>
            </tr>

          ) : (

            filteredEmployees.map((emp) => (

              <tr key={emp.id}>

                <td>{emp.id}</td>
                <td>{emp.empid}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>{emp.salary}</td>

                <td>

                  <button
                    onClick={() => editEmployee(emp)}
                    style={{
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    style={{
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      marginLeft: "5px",
                      cursor: "pointer",
                      borderRadius: "4px",
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

};

export default Employees;