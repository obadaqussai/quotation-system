import React from "react";

const InputField = ({ label, type = "text", value, onChange }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    />
  </div>
);

export default InputField;