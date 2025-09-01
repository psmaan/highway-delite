import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { apiFetch } from "../api"; // ensure path correct

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      // apiFetch will send cookies and Authorization header (if you stored accessToken)
      const res = await apiFetch("/notes", { method: "GET" });
      // depending on your backend, res might be { notes: [...] } or notes directly
      setNotes(res.notes || res);
    } catch (err: any) {
      console.error("fetchNotes error:", err.message);
      // if unauthorized, navigate to sign-in
      if (err.message && err.message.toLowerCase().includes("unauthorized")) {
        // clear stored token just in case
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" }); // will clear cookies server-side
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (err) {
      console.error("logout error", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">My Notes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg"
            >
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
