import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const slots = ["L1","L2","L3","L4","L5","L6","L7","L8","L9","L10"];

export default function Timetable() {
  const [data, setData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("https://classroom-schedular-1.onrender.com/api/timetable");
    setData(res.data);
  };

  const getCell = (day, slot) => {
    return data.find((d) => d.day === day && d.slot === slot);
  };

  const handleSave = async () => {
  try {
    // 🔴 CASE 1: NONE → DELETE
    if (!selectedCell.cell.department) {
      await await axios.delete(
  `https://classroom-schedular-1.onrender.com/api/timetable/delete?day=${selectedCell.day}&slot=${selectedCell.slot}`
);

      setSelectedCell(null);
      fetchData();
      return;
    }

    // 🟢 CASE 2: CREATE / UPDATE
    await axios.put("https://classroom-schedular-1.onrender.com/api/timetable/update", {
      day: selectedCell.day,
      slot: selectedCell.slot,
      department: selectedCell.cell.department,
      subjectName: subject,
      subjectCode,
      teacher,
      branch,
      section
    });

    setSelectedCell(null);
    fetchData();

  } catch (err) {
    console.log(err);
    alert("Error saving");
  }
};

  const downloadPDF = async () => {
  const element = document.getElementById("timetable");

  const canvas = await html2canvas(element,{ scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  
  const pdf = new jsPDF("landscape");
  pdf.addImage(imgData, "PNG", 10, 10, 270, 150);
  pdf.save("timetable.pdf");
};

  const subjectReverseMap = {
    DS: "ITPC307",
    OS: "ITPC302",
    DBMS: "CSPC302"
  };

  const branches = ["IT","CSE","ECE","MECH","AIML","PIE"];
  const sections = ["A","B","C"];
  const teachers = ["Dr A","Dr B","Dr C"];

  return (
    <>
      <Navbar />

      <div style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        paddingTop: "30px"
      }}>

        <div id="timetable" style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          overflowX: "auto"
        }}>

          <h2 style={{ textAlign: "center", color: "#2563eb" }}>
            Timetable - Room LHC101
          </h2>
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
             <button style={btnBlue} onClick={downloadPDF}>Download PDF</button>
</div>
          <table style={{
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse",
            textAlign: "center"
          }}>

            <thead>
              <tr>
                <th style={thBlue}>Day</th>
                {slots.map((s) => (
                  <th key={s} style={thDark}>{s}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td style={td}><b>{day}</b></td>

                  {slots.map(slot => {
                    const cell = getCell(day, slot);

                    return (
                      <td
                        key={slot}
                        style={td}
                        onClick={() => {

                          // ❌ block empty only for dept admin
                          if (!cell && user.role !== "SYSTEM_ADMIN") return;

                          // ❌ dept admin restriction
                          if (
                            user.role === "DEPT_ADMIN" &&
                            cell &&
                            user.department !== cell.department
                          ) {
                            alert("You can only edit your department");
                            return;
                          }

                          const safeCell = cell || {
                            department: "",
                            subjectName: "",
                            subjectCode: "",
                            teacher: "",
                            branch: "",
                            section: ""
                          };

                          setSelectedCell({ day, slot, cell: safeCell });

                          setSubject(safeCell.subjectName || "");
                          setSubjectCode(safeCell.subjectCode || "");
                          setTeacher(safeCell.teacher || "");
                          setBranch(safeCell.branch || "");
                          setSection(safeCell.section || "");
                        }}
                      >
                        {cell ? (
                          <>
                            <div><b>{cell.department}</b></div>
                            <div>{cell.subjectName}</div>
                            <div style={{ fontSize: "12px" }}>{cell.teacher}</div>
                            {/* <div style={{ fontSize: "11px", color: "#555" }}>
                              {cell.room ? `Room: ${cell.room}` : ""}
                            </div> */}
                          </>
                        ) : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedCell && (
        <div style={overlay}>
          <div style={modal}>

            <h3>Edit Time Slot</h3>

            {/* 🔵 SYSTEM ADMIN */}
            {user.role === "SYSTEM_ADMIN" ? (
              <>
                <label>Department</label>
                <select
                  value={selectedCell.cell.department}
                  onChange={(e) =>
                    setSelectedCell({
                      ...selectedCell,
                      cell: {
                        ...selectedCell.cell,
                        department: e.target.value
                      }
                    })
                  }
                  style={input}
                >
                  <option value="">None</option>
                  <option>IT</option>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>MECH</option>
                  <option>AIML</option>
                  <option>PIE</option>
                </select>

                <br /><br />

                <button style={btnBlue} onClick={handleSave}>Save</button>
                <button style={btnRed} onClick={() => setSelectedCell(null)}>Cancel</button>
              </>
            ) : (

              <>
                <label>Department</label>
                <input value={selectedCell.cell.department} disabled style={input} />

                <br /><br />

                {/* ✅ SUBJECT FIRST */}
                <label>Subject</label>
                <select
                  value={subject}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSubject(val);
                    setSubjectCode(subjectReverseMap[val] || "");
                  }}
                  style={input}
                >
                  <option value="">Select</option>
                  <option>DS</option>
                  <option>OS</option>
                  <option>DBMS</option>
                </select>

                <br /><br />

                <label>Subject Code</label>
                <input value={subjectCode} disabled style={input} />

                <br /><br />

                

                <label>Section</label>
                <select value={section} onChange={(e)=>setSection(e.target.value)} style={input}>
                  <option value="">Select</option>
                  {sections.map(s => <option key={s}>{s}</option>)}
                </select>

                <br /><br />

                <label>Teacher</label>
                <select value={teacher} onChange={(e)=>setTeacher(e.target.value)} style={input}>
                  <option value="">Select</option>
                  {teachers.map(t => <option key={t}>{t}</option>)}
                </select>

                <br /><br />

                <button style={btnBlue} onClick={handleSave}>Save</button>
                <button style={btnRed} onClick={() => setSelectedCell(null)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

}
/* STYLES */
const thBlue = { background:"#2563eb",color:"white",padding:"10px" };
const thDark = { background:"#333",color:"white" };
const td = { padding:"12px",border:"1px solid #eee",cursor:"pointer" };

const overlay = {
  position:"fixed",top:0,left:0,width:"100%",height:"100%",
  background:"rgba(0,0,0,0.4)",
  display:"flex",justifyContent:"center",alignItems:"center"
};

const modal = {
  background:"white",padding:"25px",width:"320px",
  borderRadius:"12px",boxShadow:"0 10px 25px rgba(0,0,0,0.2)"
};

const input = { width:"100%",padding:"8px" };

const btnBlue = {
  background:"#2563eb",color:"white",border:"none",
  padding:"8px 12px",marginRight:"10px",borderRadius:"6px"
};

const btnRed = {
  background:"#ef4444",color:"white",border:"none",
  padding:"8px 12px",borderRadius:"6px"
};