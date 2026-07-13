export const colors = {
  primary: "#1976d2",
  primaryDark: "#1565c0",
  success: "#2e7d32",
  danger: "#d32f2f",
  warning: "#ed6c02",
  white: "#ffffff",
  background: "#f4f6f9",
  border: "#dddddd",
  text: "#333333",
  sidebar: "#05860d",
};

export const button = {
  primary: {
    background: colors.primary,
    color: colors.white,
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  success: {
    background: colors.success,
    color: colors.white,
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  danger: {
    background: colors.danger,
    color: colors.white,
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export const input = {
  width: "100%",
  padding: "10px",
  border: `1px solid ${colors.border}`,
  borderRadius: "6px",
  outline: "none",
  boxSizing: "border-box",
};

export const card = {
  background: colors.white,
  borderRadius: "10px",
  padding: "25px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
};

export const tableHeader = {
  background: colors.primary,
  color: colors.white,
};

export const pageTitle = {
  color: colors.primary,
  marginBottom: "20px",
};