// import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'


import { useState, useEffect } from "react";

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("bg-yellow-200");

  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notes")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote(e) {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter note content!");
      return;
    }

    const newNote = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      color: color,
      date: new Date().toLocaleDateString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setTitle("");
    setContent("");
    setColor("bg-yellow-200");
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  function changeNoteColor(id, newColor) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, color: newColor } : note
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        My Notes
      </h1>

      <form
        onSubmit={addNote}
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

        <p className="mb-2 font-medium">Choose note color:</p>

        <div className="mb-4 flex flex-wrap gap-3">
          {colors.map((item) => (
            <button
              key={item.name}
              type="button"
              title={item.name}
              aria-label={item.name}
              onClick={() => setColor(item.class)}
              className={`h-9 w-9 rounded-full border border-gray-400 ${item.class} ${
                color === item.class
                  ? "ring-2 ring-gray-800 ring-offset-2"
                  : ""
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 p-3 font-semibold text-white hover:bg-amber-600"
        >
          + Add Note
        </button>
      </form>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`rounded-xl p-5 shadow transition hover:shadow-lg ${note.color}`}
          >
            <h2 className="mb-2 break-words text-xl font-bold">
              {note.title || "Untitled"}
            </h2>

            <p className="mb-4 whitespace-pre-wrap break-words text-gray-800">
              {note.content}
            </p>

            <p className="mb-3 text-sm text-gray-600">{note.date}</p>

            <p className="mb-2 text-sm font-medium">Change color:</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {colors.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  title={item.name}
                  aria-label={`Change note color to ${item.name}`}
                  onClick={() => changeNoteColor(note.id, item.class)}
                  className={`h-7 w-7 rounded-full border border-gray-400 ${item.class}`}
                />
              ))}
            </div>

            <button
              onClick={() => deleteNote(note.id)}
              className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          No notes found
        </p>
      )}
    </div>
  );
}

export default App;


