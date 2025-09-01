import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { apiFetch } from "../api";
import deleteimg from "./../../public/assets/delete.png";
import hdlogo from './../../public/assets/hd-logo.png';

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await apiFetch("/notes", { method: "GET" });
      setNotes(res.notes || []);
    } catch (err: any) {
      console.error("fetchNotes error:", err.message);
      if (err.message?.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    }
  };

  // Create note
  const createNote = async () => {
    if (!content.trim()) return;
    try {
      await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("createNote error:", err);
    }
  };

  // Delete note
  const deleteNote = async (id: string) => {
    try {
      await apiFetch(`/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("deleteNote error:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (err) {
      console.error("logout error", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <img src={hdlogo} className="w-8 h-8 mr-2" alt="Logo" />
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            <div className="">
              <h1
                
                fullWidth 
                onClick={handleLogout}
                className="text-blue-500 underline cursor-pointer"
              >
              Sign Out
              </h1>
            </div> {/* Spacer for mobile layout balance */}
          </header>

          {/* Welcome card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back, {user?.name || 'User'}!</h2>
            <p className="text-gray-600">Here's your personal space to create and manage notes.</p>
          </div>

          {/* Add Note */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Note</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <TextField
                label="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <Button 
                variant="contained" 
                onClick={createNote}
                className="h-full min-w-[100px]"
                disabled={!content.trim()}
              >
                Add Note
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Notes</h2>
              <span className="text-sm text-gray-500">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
            </div>
            
            {notes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">You don't have any notes yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 relative"
                  >
                    <p className="text-gray-700 pr-8">{note.content}</p>
                    <Button
                      size="small"
                      className="!absolute top-3 right-3 min-w-0 p-1"
                    >
                      <img src={deleteimg} alt="Delete" className="w-6 h-6" onClick={() => deleteNote(note._id)}/>
                    </Button>
                    <div className="text-xs text-gray-400 mt-3">
                      {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}