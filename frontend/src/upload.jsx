import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleUpload = async () => {
    if (!file) {
    alert("Please select a file first");
    return;
  }
    const formData = new FormData();
    formData.append("file", file);

    try{
    setLoading(true);
    await axios.post("https://classroom-schedular.onrender.com/api/auth/login", formData);
    setLoading(true);

     setTimeout(() => {
      window.location.href = "/timetable";
    }, 300);

   } catch (err) {
    console.log(err);
    alert("Upload failed ❌");
  }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Upload Timetable Excel</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

     
      <button onClick={handleUpload}>{loading ? "Uploading..." : "Upload"}</button>
    </div>
  );
}