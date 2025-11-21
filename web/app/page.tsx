"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function CockShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cocks, setCocks] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [likes, setLikes] = useState<{ [key: number]: number }>({});

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Fetch cocks from backend
  async function getCocks() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/posts/?q=${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCocks(data);

      // Initialize comments and likes
      const initialComments: { [key: number]: string[] } = {};
      const initialLikes: { [key: number]: number } = {};
      data.forEach((c: any) => {
        initialComments[c.id] = [];
        initialLikes[c.id] = 0;
      });
      setComments(initialComments);
      setLikes(initialLikes);
    }
  }

  useEffect(() => {
    getCocks();
  }, []);

  const filteredCocks = cocks.filter((c) =>
    c.bloodline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCommentSubmit = (id: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment[id] || newComment[id].trim() === "") return;

    setComments((prev) => ({
      ...prev,
      [id]: [...prev[id], newComment[id].trim()],
    }));

    setNewComment((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleLike = (id: number) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-700">
        Digital Game Farm - Fighting Cocks
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by bloodline..."
          className="w-full max-w-md p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCocks.map((cock) => (
          <div
            key={cock.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <div className="relative w-full h-48 overflow-hidden rounded mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND}${cock.image1}`}
                alt={cock.bloodline}
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
                unoptimized
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-1">{cock.bloodline}</h2>
            <p className="text-gray-600 text-sm mb-2">
              {cock.description || "High-quality fighting cock."}
            </p>
            <p className="text-yellow-700 font-bold text-lg mb-2">₱{cock.price || 100}</p>

            {/* Like Button */}
            <button
              onClick={() => handleLike(cock.id)}
              className="flex items-center gap-2 text-red-600 font-semibold mb-3"
            >
              ❤️ {likes[cock.id]}
            </button>

            <button className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition mb-3">
              Order Now
            </button>

            {/* Comment Section */}
            <div className="mt-2">
              <form onSubmit={(e) => handleCommentSubmit(cock.id, e)}>
                <input
                  type="text"
                  placeholder="Add a formal comment..."
                  value={newComment[cock.id] || ""}
                  onChange={(e) =>
                    setNewComment((prev) => ({ ...prev, [cock.id]: e.target.value }))
                  }
                  className="w-full p-1 border border-gray-300 rounded mb-1 text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded w-full text-xs"
                >
                  Comment
                </button>
              </form>

              {/* Display comments in small, formal style */}
              <div className="mt-1 max-h-24 overflow-y-auto">
                {comments[cock.id]?.map((c, idx) => (
                  <p key={idx} className="text-xs text-gray-700 border-b border-gray-200 py-0.5">
                    {c}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
