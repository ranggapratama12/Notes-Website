"use client";

import React, { useEffect, useState } from "react";
import CardNotes from "@/components/my-components/CardNotes";
import { Loader, FilePlus2 } from "lucide-react";
import jwt from "jsonwebtoken";
import clsx from "clsx";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`);
        const data = await response.json();
        if (data.code === 200) {
          setNotes(data.data.notes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Token tidak valid:", error);
      }
    }

    fetchNotes();
  }, []);

  const filteredNotes =
    activeTab === "my" && userId
      ? notes.filter((note) => note.id_user === userId)
      : notes;

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-[#710193] mb-6">
        📚 Notes Collection
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-10 gap-4">
        <button
          className={clsx(
            "px-4 py-2 rounded-full font-medium",
            activeTab === "all"
              ? "bg-[#710193] text-white"
              : "bg-gray-200 text-[#710193]"
          )}
          onClick={() => setActiveTab("all")}
        >
          All Notes
        </button>
        <button
          className={clsx(
            "px-4 py-2 rounded-full font-medium",
            activeTab === "my"
              ? "bg-[#710193] text-white"
              : "bg-gray-200 text-[#710193]"
          )}
          onClick={() => setActiveTab("my")}
        >
          My Notes
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="mt-20 flex flex-col justify-center items-center gap-4 text-center text-xl text-[#710193] animate-pulse">
          <Loader size={32} className="animate-spin text-[#710193]" />
          <p>Mengambil catatan...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="mt-24 flex flex-col items-center justify-center text-gray-500">
          <FilePlus2 size={48} className="mb-4 text-blue-400" />
          <p className="text-lg">
            {activeTab === "my"
              ? "Kamu belum membuat catatan."
              : "Belum ada catatan yang tersedia."}
          </p>
          <p className="text-sm mt-2 text-muted-foreground">
            Klik tombol tambah catatan untuk memulai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {filteredNotes.map((note) => (
            <CardNotes key={note.id} note={note} isOwner={note.id_user === userId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
