import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../services/api";
import Layout from "../components/Layout";

const Reports = () => {
  const [type, setType] = useState("employees");
  const [data, setData] = useState([]);

  useEffect(() => {
    loadReport(type);
  }, [type]);

  const loadReport = async (report) => {
    try {
      const res = await api.get(`/reports/${report}`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const exportExcel = () => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, type);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `${type}.xlsx`);
  };

  return (
    <Layout>
      <h1>Reports</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: 10, width: 250 }}
        >
          <option value="employees">Employees</option>
          <option value="departments">Departments</option>
          <option value="attendance">Attendance</option>
          <option value="leaves">Leaves</option>
          <option value="payroll">Payroll</option>
        </select>

        <button onClick={exportExcel}>
          Export Excel
        </button>
      </div>

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
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td align="center">No Records Found</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{String(value)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default Reports;