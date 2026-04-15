import Navbar from "./Navbar";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/upload", formData);

      alert("Upload successful ✅");

      setUploaded(true);

      // 🚀 redirect immediately
      navigate("/timetable");

    } catch (err) {
      alert("Upload failed ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "30px"
      }}>

        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
        }}>

          <h2 style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "20px"
          }}>
            Dashboard
          </h2>

          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center"
          }}>

            <thead>
              <tr>
                <th style={thStyle}>Room No</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>LHC101</td>

                <td style={tdStyle}>

                  {/* SYSTEM ADMIN */}
                  {user.role === "SYSTEM_ADMIN" && (
                    <>
                      {/* FILE INPUT */}
                      <input
                        type="file"
                        disabled={uploaded}   // ✅ disable after upload
                        onChange={(e) => setFile(e.target.files[0])}
                      />

                      <br /><br />

                      <button
                        style={{
                          ...blueBtn,
                          opacity: uploaded ? 0.5 : 1,
                          cursor: uploaded ? "not-allowed" : "pointer"
                        }}
                        disabled={uploaded}
                        onClick={handleUpload}
                      >
                        Upload
                      </button>

                      <button style={redBtn}>
                        Delete
                      </button>

                      {/* ✅ SHOW AFTER UPLOAD */}
                      {uploaded && (
                        <>
                          <br /><br />
                          <button
                            style={blueBtn}
                            onClick={() => navigate("/timetable")}
                          >
                            View Timetable
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {/* DEPT ADMIN */}
                  {user.role === "DEPT_ADMIN" && (
                    <button
                      style={blueBtn}
                      onClick={() => navigate("/timetable")}
                    >
                      View Timetable
                    </button>
                  )}

                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}

/* STYLES */

const thStyle = {
  background: "#2563eb",
  color: "white",
  padding: "12px"
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #eee"
};

const blueBtn = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px"
};

const redBtn = {
  padding: "8px 12px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};