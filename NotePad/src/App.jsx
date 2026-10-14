import { useState } from "react";
import "./App.css";

import { useNotes } from "./NotesContext.jsx";

const colors = [
  { name: "Red", class: "bg-red-200" },
  { name: "Purple", class: "bg-purple-200" },
  { name: "Blue", class: "bg-blue-200" },
  { name: "Yellow", class: "bg-yellow-200" },
  { name: "Pink", class: "bg-pink-200" },
  { name: "Green", class: "bg-green-200" },
  { name: "Orange", class: "bg-orange-200" },
  { name: "White", class: "bg-white" },
];

function App() {
  const {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    searchNotes,
    fetchNotes,
  } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("bg-yellow-200");

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter note content!");
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      color,
      tags: [],
      stock: 0,
    };

    let success;

    if (editId !== null) {
      success = await updateNote(editId, noteData);
    } else {
      success = await createNote(noteData);
    }

    if (success) {
      resetForm();
    }
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setColor("bg-yellow-200");
    setEditId(null);
  }

  function handleEdit(note) {
    setTitle(note.title || "");
    setContent(note.content || "");
    setColor(note.color || "bg-yellow-200");
    setEditId(note.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id);
    }
  }

  const searchedNotes = searchNotes(search);

  const visibleNotes = searchedNotes.filter((note) =>
    showArchived ? note.archived : !note.archived
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        My Notes
      </h1>

      {/* Create / Edit Form */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-8 max-w-lg rounded-xl bg-white p-5 shadow"
      >
        <input
          type="text"
          placeholder="Note title (optional)"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          maxLength={5000}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          rows="4"
        />

        <p className="mb-2 font-medium">
          Choose note color:
        </p>

        <div className="mb-4 flex flex-wrap gap-3">
          {colors.map((item) => (
            <button
              key={item.name}
              type="button"
              title={item.name}
              aria-label={item.name}
              onClick={() => setColor(item.class)}
              className={`h-9 w-9 rounded-full border border-gray-400 ${
                item.class
              } ${
                color === item.class
                  ? "ring-2 ring-gray-800 ring-offset-2"
                  : ""
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-500 p-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : editId !== null
            ? "Update Note"
            : "+ Add Note"}
        </button>

        {editId !== null && (
          <button
            type="button"
            onClick={resetForm}
            className="mt-3 w-full rounded-lg bg-gray-500 p-3 font-semibold text-white hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Search */}

      <div className="mx-auto mb-6 max-w-lg">
        <input
          type="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* Archive Filter */}

      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          {showArchived ? "Archived Notes" : "My Notes"}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setShowArchived(false)}
            className={`rounded-lg px-4 py-2 ${
              !showArchived
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setShowArchived(true)}
            className={`rounded-lg px-4 py-2 ${
              showArchived
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Error Message */}

      {error && (
        <div className="mx-auto mb-4 max-w-5xl rounded-lg bg-red-100 p-4 text-red-700">
          <p>{error}</p>

          <button
            onClick={fetchNotes}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Spinner */}

      {loading && notes.length === 0 && (
        <div className="flex justify-center py-10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        </div>
      )}

      {/* Notes List */}

      {!loading && visibleNotes.length > 0 && (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleNotes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl p-5 shadow transition hover:shadow-lg ${
                note.color || "bg-yellow-200"
              }`}
            >
              <h2 className="mb-2 break-words text-xl font-bold">
                {note.title || "Untitled"}
              </h2>

              <p className="mb-4 whitespace-pre-wrap break-words text-gray-800">
                {note.content}
              </p>

              <p className="mb-3 text-sm text-gray-600">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleDateString()
                  : ""}
              </p>

              {note.updatedAt && (
                <p className="mb-3 text-xs text-gray-600">
                  Updated:{" "}
                  {new Date(note.updatedAt).toLocaleString()}
                </p>
              )}

              {/* Change Color */}

              <p className="mb-2 text-sm font-medium">
                Change color:
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {colors.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    title={item.name}
                    aria-label={`Change note color to ${item.name}`}
                    onClick={() =>
                      updateNote(note.id, {
                        color: item.class,
                      })
                    }
                    className={`h-7 w-7 rounded-full border border-gray-400 ${
                      item.class
                    } ${
                      note.color === item.class
                        ? "ring-2 ring-gray-800"
                        : ""
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}

              <div className="flex flex-wrap gap-2">
                {!note.archived && (
                  <button
                    onClick={() => handleEdit(note)}
                    className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => toggleArchive(note.id)}
                  className="rounded-lg bg-purple-500 px-3 py-2 text-white hover:bg-purple-600"
                >
                  {note.archived ? "Restore" : "Archive"}
                </button>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}

      {!loading && visibleNotes.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          {search
            ? "No matching notes found."
            : showArchived
            ? "No archived notes found."
            : "No notes found."}
        </p>
      )}
    </div>
  );
}

export default App;