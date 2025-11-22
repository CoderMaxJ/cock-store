"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import userToken from "./api/user/token";
import { useRouter } from "next/navigation";

export default function CockShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cocks, setCocks] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [likes, setLikes] = useState<{ [key: number]: number }>({});

 const router = useRouter();
  const token = userToken();

  // Fetch cocks from backend
  async function getCocks() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/posts/?q=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCocks(data);

      // Initialize comments & likes
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

  const handleLike = (id: number) => {
    setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mb-10">

      {/* Header (fixed) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md p-4 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-center 
            bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 
            text-transparent bg-clip-text drop-shadow-lg tracking-wide">
          Get your Warrior
        </h1>

        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by bloodline..."
            className="w-full max-w-md p-3 border border-gray-300 rounded shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="pt-40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                      lg:grid-cols-4 xl:grid-cols-5 gap-6">

        {filteredCocks.map((cock) => (
          <div
            key={cock.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden rounded mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND}${cock.image1}`}
                alt={cock.bloodline}
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
                unoptimized
                onClick={()=>router.push(`/cock-details/${cock.id}`)}
              />
            </div>

            {/* Info */}
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {cock.bloodline}
            </h2>

            <p className="text-gray-600 text-sm mb-2">
              {cock.description || "High-quality fighting cock."}
            </p>

            <p className="text-yellow-700 font-bold text-lg mb-2">
              ₱{cock.price || 100}
            </p>

            <p className="text-gray-600 text-sm mb-2">
              Location: {cock.location}
            </p>

            {/* Like Buttons */}
            <div className="flex justify-evenly mb-3">
              {/* Heart */}
              <button
                onClick={() => handleLike(cock.id)}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                ❤️ {likes[cock.id]}
              </button>

              {/* Chat */}
              <button
                onClick={() => handleLike(cock.id)}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                💬 {likes[cock.id]}
              </button>

              {/* Horn */}
              <button
                onClick={() => handleLike(cock.id)}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                📢 {likes[cock.id]}
              </button>
            </div>

            {/* Order Button */}
            <button className="flex justify-center gap-3 mt-auto bg-blue-600 
                               hover:bg-yellow-600 text-white font-semibold py-2 
                               rounded transition mb-3">
              Order Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 animate-bounce"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 
                     2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 
                     5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 
                     0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
