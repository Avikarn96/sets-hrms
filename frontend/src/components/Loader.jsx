const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #ddd",
          borderTop: "5px solid #1976d2",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <p
        style={{
          marginTop: "20px",
          color: "#1976d2",
          fontWeight: "bold",
        }}
      >
        Loading...
      </p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;