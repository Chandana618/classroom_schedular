export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{
      width: "100%",
      background: "#2563eb"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}>
        <h3>📅 Classroom Scheduler</h3>

        <div>
          <span style={{ marginRight: "15px" }}>
            {user?.role}
          </span>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={{
              padding: "6px 12px",
              background: "white",
              color: "#2563eb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}