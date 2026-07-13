import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "240px",
        }}
      >
        <Navbar />

        <div
          style={{
            padding: "25px",
            marginTop: "70px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;