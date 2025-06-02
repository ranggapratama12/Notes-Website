"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
    } else {
      try {
        const decodedToken = jwt.decode(token);
        setIsLoggedIn(decodedToken?.userId ? true : false);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#E4A0F7]/10 flex flex-col justify-center items-center p-6">
      {/* Container utama */}
      <div
        className="text-center p-8 max-w-4xl bg-white rounded-2xl shadow-md border border-[#710193] opacity-0 translate-y-6 animate-fadeIn"
        style={{ animationDelay: "0s" }}
      >
        <h1
          className="text-5xl md:text-6xl font-extrabold text-[#710193] mb-6 opacity-0 translate-y-6 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          Welcome to NotesApp
        </h1>
        <p
          className="text-lg md:text-xl text-[#AF69EE] mb-6 max-w-xl mx-auto opacity-0 translate-y-6 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          A simple and powerful note-taking app for your everyday thoughts.
        </p>
        <Link href={isLoggedIn ? "/notes/create" : "/login"}>
          <p
            className="relative z-10 inline-block px-8 py-3 mb-4 bg-[#4F0341]  text-white rounded-lg text-lg font-semibold shadow hover:bg-purple-500/90 transition duration-300 translate-y-6 animate-fadeIn opacity-0"
            style={{ animationDelay: "0.6s" }}
          >
            Create a New Note
          </p>
        </Link>
      </div>

      {/* Features */}
      <div className="mt-20 max-w-7xl w-full px-2">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#710193] mb-10 text-left opacity-0 translate-y-6 animate-fadeIn"
          style={{ animationDelay: "0.8s" }}
        >
          Features
        </h2>
          <p className="text-xl text-purple-600/90 max-w-2xl pb-6 -mt-6">
              
              Everything you need to record, organize, and access your thoughts easily
              </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Create Notes",
              description:
                "Create and organize your notes with ease. Add title and content to each note.",
              icon: (
                <svg
                  className="w-10 h-10 text-[#710193] mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20h9M12 4h9M12 12h9M3 6h.01M3 18h.01M3 12h.01"
                  />
                </svg>
              ),
            },
            {
              title: "View Notes",
              description:
                "Browse all your notes and find them easily whenever you need.",
              icon: (

                <svg
                  className="w-10 h-10 text-[#710193] mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"

                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10l4.553-2.276a2 2 0 011.447 3.666l-4.553 2.275a2 2 0 01-1.447-3.665zM3 19v-4a4 4 0 014-4h12"
                  />
                </svg>
              ),
            },
            {
              title: "Edit Notes",
              description:
                "Update and modify your notes whenever needed with just a few clicks.",
              icon: (
                <svg
                  className="w-10 h-10 text-[#710193] mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5h6M7 8h10M7 12h10M7 16h10M7 20h10"
                  />
                </svg>
              ),
            },
          ].map(({ title, description, icon }, i) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 translate-y-6 animate-fadeIn"
              style={{ animationDelay: `${1 + i * 0.2}s` }}
            >
              {icon}
              <h3 className="text-xl font-semibold text-[#710193] mb-2">
                {title}
              </h3>
              <p className="text-[#AF69EE]">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
          animation-duration: 0.6s;
          animation-fill-mode: forwards;
          animation-timing-function: ease-out;
        }
      `}</style>
    </div>
  );
}
