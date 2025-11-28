"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import userToken from "./api/user/token";
import SearchInput from "@/components/search/page";
import Spinner from "@/components/loading/page";
import DropDown from "@/components/dropdown/page";
import CockType from "@/components/dropdown/cocktype/page";

export default function CockShopPage() {
  const [cocks, setCocks] = useState<any[]>([]);
  const [user, setUser] = useState("");
  const [isLoading, setLoading] = useState(false);
  
  const type = localStorage.getItem("category") ?? "";
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const router = useRouter();
  const token = userToken();

  // Fetch cocks whenever search query changes
  async function getCocks() {
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/posts/?q=${query}&t=${type}`,
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
      setCocks(data.data);
      if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      }
    }

    setUser(localStorage.getItem("user") || "Guest");
    setLoading(false);
  }

  // Fetch on initial load + whenever ?query changes
  useEffect(() => {
    getCocks();
  }, [query,type]);

  // Auto redirect guest
  useEffect(() => {
    if (user === "Guest") {
      const timer = setTimeout(() => router.replace("/auth/login"), 20000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // React button action
  async function react(id: Number, type: String) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/react/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, type }),
    });

    if (response.status === 200) {
      getCocks(); // refresh counts
    }
  }

  return (
    <div
      className={`min-h-screen bg-gray-100 mb-10 m-0 p-0 ${
        isLoading ? "opacity-40 pointer-events-none" : ""
      }`}
    >

      {isLoading && <Spinner />}

      {/* Header */}
      <div className="fixed top-0 left-0 h-[258px] right-0 z-50 bg-black rounded backdrop-blur-md p-4 shadow-lg">
        {/* Banner */}
        <div className="relative w-full h-[150px] relative rounded bg-center bg-cover bg-no-repeat" style={{backgroundImage:"url(/images/templates/template.png)"}}>
           <div className="absolute right-0">
              <DropDown/>
           </div>
            
             <div className="absolute top-38 flex items-center justify-center gap-5 w-full rounded bg-black p-2">
                <SearchInput />

                <CockType Signal={getCocks}/>
          </div>
        </div>

        {/* Search + User */}
        
      </div>

      {/* Grid */}
      <div className="pt-67 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cocks.length < 1 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-700">No results found</h2>
              <p className="text-gray-500 mt-2">Please specify the bloodline.</p>
          </div>

        )}
        {cocks.map((cock) => (
          <div
            key={cock.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-100 overflow-hidden rounded mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND}${cock.image1}`}
                alt={cock.bloodline}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
                unoptimized
                onClick={() => router.push(`/cock-details/${cock.id}`)}
              />
            </div>

            {/* Info */}
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {cock.bloodline}
            </h2>

            <p className="text-gray-600 text-sm mb-2">Age: {cock.age}</p>
            {cock.victory && (
              <p className="text-gray-600 text-sm mb-2">
                {cock.victory}x Winner
              </p>
            )}
            <p className="text-gray-600 text-sm mb-2">
              Class {cock.category}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Location: {cock.location}
            </p>

            {/* Spar Link */}
            {cock.spar_link && (
              <a
                href={cock.spar_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg shadow-sm text-gray-700 text-sm font-medium mb-2"
              >
                ▶ Watch Spar
              </a>
            )}

            {/* Price */}
            <p className="text-black font-bold text-lg mb-2">
              ₱{cock.price || 100}
            </p>

            {/* Reaction Buttons */}
            <div className="flex justify-evenly mb-3">
              <button
                onClick={() => react(cock.id, "heart")}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                ❤️ {cock.heart}
              </button>

              <button
                onClick={() => react(cock.id, "comment")}
                className="flex items-center gap-2 text-red-600 text-xl font-semibold"
              >
                💬
              </button>

              <button
                onClick={() => react(cock.id, "like")}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                👍 {cock.like}
              </button>
            </div>

            {/* Order Button */}
            <button className="flex justify-center gap-3 mt-auto bg-blue-600 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition mb-3">
              Order Now
            </button>

            <div className="flex w-full justify-between">
              <p className="text-gray-600 text-xs mb-2">By: {cock.owner_username}</p>
              <p className="text-gray-600 text-xs mb-2">
                Posted: {cock.date_posted}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
