import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/notes";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL);

      setNotes(response.data);
    } catch (err) {
      setError("Failed to load notes.");
      toast.error("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Create note
  const createNote = async (note) => {
    setLoading(true);
    setError(null);

    const now = new Date().toISOString();

    const newNote = {
      title: note.title.trim(),
      content: note.content.trim(),
      color: note.color,
      tags: note.tags || [],
      archived: false,
      stock: note.stock ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const response = await axios.post(API_URL, newNote);

      setNotes((prev) => [response.data, ...prev]);

      toast.success("Note created successfully!");

      return true;
    } catch (err) {
      setError("Failed to create note.");
      toast.error("Failed to create note.");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update note
  const updateNote = async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const existingNote = notes.find(
        (note) => String(note.id) === String(id)
      );

      if (!existingNote) {
        throw new Error("Note not found.");
      }

      const updatedNote = {
        ...existingNote,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.put(
        `${API_URL}/${id}`,
        updatedNote
      );

      setNotes((prev) =>
        prev.map((note) =>
          String(note.id) === String(id)
            ? response.data
            : note
        )
      );

      toast.success("Note updated successfully!");

      return true;
    } catch (err) {
      setError("Failed to update note.");
      toast.error("Failed to update note.");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_URL}/${id}`);

      setNotes((prev) =>
        prev.filter(
          (note) => String(note.id) !== String(id)
        )
      );

      toast.success("Note deleted successfully!");

      return true;
    } catch (err) {
      setError("Failed to delete note.");
      toast.error("Failed to delete note.");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle archive
  const toggleArchive = async (id) => {
    const note = notes.find(
      (item) => String(item.id) === String(id)
    );

    if (!note) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `${API_URL}/${id}`,
        {
          archived: !note.archived,
          updatedAt: new Date().toISOString(),
        }
      );

      setNotes((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? response.data
            : item
        )
      );

      toast.success(
        response.data.archived
          ? "Note archived!"
          : "Note restored!"
      );

      return true;
    } catch (err) {
      setError("Failed to archive note.");
      toast.error("Failed to archive note.");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Search notes using API data
  const searchNotes = (query) => {
    const searchTerm = query.trim().toLowerCase();

    return notes.filter((note) => {
      const title = (note.title || "").toLowerCase();
      const content = (note.content || "").toLowerCase();

      const tags = Array.isArray(note.tags)
        ? note.tags.join(" ").toLowerCase()
        : "";

      return (
        title.includes(searchTerm) ||
        content.includes(searchTerm) ||
        tags.includes(searchTerm)
      );
    });
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        createNote,
        updateNote,
        deleteNote,
        toggleArchive,
        searchNotes,
        fetchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}