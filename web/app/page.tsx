"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import userToken from "./api/user/token";
import SearchInput from "@/components/search/page";
import Spinner from "@/components/loading/page";
import DropDown from "@/components/dropdown/page";
import CockType from "@/components/dropdown/cocktype/page";
import { Suspense } from 'react'; // Import Suspense
import CommentSection from "@/components/comments/page";

export default function CockShopPage() {
  const [cocks, setCocks] = useState<any[]>([]);
  const [user, setUser] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [type,setType]=useState("");
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const [isShrunk, setIsShrunk] = useState(false); // ⭐ new
  const [isliked,setIsLiked]=useState(false);
  const [isreacted,setIsreacted]=useState(false);
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);


  const router = useRouter();
  const token = userToken();
  useEffect(()=>{
    if (typeof window !== "undefined") {
    setType(localStorage.getItem("category") ?? "");
    }
  },[getCocks])
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

    if (typeof window !== "undefined") {
      setUser(localStorage.getItem("user") || "Guest");
    }
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
async function react(id: number, action: string) {
  if(action === "like"){
    setIsLiked(true);
    setTimeout(()=>{
      setIsLiked(false);
    },1000)
  }
  if (action ==="heart"){
    setIsreacted(true);
    setTimeout(()=>{
      setIsreacted(false);
    },1000)
  }
  // 1. Optimistic UI update
  setCocks((prevCocks) =>
    prevCocks.map((cock) =>
      cock.id === id
        ? {
            ...cock,
            heart: action === "heart" ? cock.heart + 1 : cock.heart,
            like: action === "like" ? cock.like + 1 : cock.like,
          }
        : cock
    )
  );

  // 2. Send to backend
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/react/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, type: action }),
  });

  // 3. If backend fails, rollback UI
  if (!response.ok) {
    setCocks((prevCocks) =>
      prevCocks.map((cock) =>
        cock.id === id
          ? {
              ...cock,
              heart: action === "heart" ? cock.heart - 1 : cock.heart,
              like: action === "like" ? cock.like - 1 : cock.like,
            }
          : cock
      )
    );
  }
}
  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 50) {
        setTimeout(()=>{
          setIsShrunk(true); // scroll down
        },1000)
        
      } else {
        setTimeout(()=>{
          setIsShrunk(false); // scroll up
        },1000)
        
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`min-h-screen bg-gray-100 mb-10 m-0 p-0 ${
        isLoading ? "opacity-40 pointer-events-none" : ""
      }`}
    >

      {isLoading && <Spinner />}

      {/* Header */}
      <div className="fixed top-0 left-0  h-[258px] right-0 z-50 bg-black rounded backdrop-blur-md p-4 shadow-lg" style={{display: isShrunk ? "none":"block"}}>
        {/* Banner */}
        <div className="relative w-full h-[150px] relative rounded bg-center bg-cover bg-no-repeat" style={{backgroundImage:"url(/images/templates/template.png)"}}>
           <div className="absolute right-0">
              <DropDown/>
           </div>
            
             <div className="absolute top-38 flex items-center justify-center gap-5 w-full rounded bg-black p-2">
                <Suspense fallback={<div>Loading search bar...</div>}>
                  <SearchInput />
                </Suspense>
                

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
            {cock.victory > 0 && (
              <p className="text-gray-600 text-sm mb-2">
                {cock.victory}x Winner
              </p>
            )}
            <p className="text-gray-600 text-sm mb-2">
              Class: {cock.category}
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
                style={{fontSize: isreacted ? "20px": ""}}
              >
                ❤️ {cock.heart}
              </button>

               <button
                onClick={() => setActiveCommentId(activeCommentId === cock.id ? null : cock.id)}
                className="flex items-center gap-2 text-blue-600 text-l font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                {cock.totalcomment}
              </button>

              <button
                onClick={() => react(cock.id, "like")}
                className="flex items-center gap-2 text-red-600 font-semibold"
                style={{fontSize: isliked ? "20px": ""}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>

                 {cock.like}
              </button>
            </div>

            {/* Order Button */}
            
            <div className="flex justify-evenly gap-2 bg-gray-100 p-4 w-full rounded">
              <a href={`tel:${cock.number}`} className="text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
              </svg>
              <span className="text-xs">call</span>
              </a>
              <a href={`sms:${cock.number}`} className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span className="text-xs">text</span>
              </a>
              <a href={cock.messenger_link} className="text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <span className="text-xs">chat</span>
              </a>


            </div>
            {/* <button className="flex justify-center gap-3 mt-auto bg-blue-600 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition mb-3">
              Order Now
            </button> */}

            <div className="flex w-full justify-between">
              <p className="text-gray-600 text-xs mb-2">By: {cock.owner_username}</p>
              <p className="text-gray-600 text-xs mb-2">
                Posted: {cock.date_posted}
              </p>
            </div>
              {activeCommentId === cock.id && <CommentSection id={cock.id} onClose={() => setActiveCommentId(null)}/>}
          </div>
        ))}
      </div>
    </div>
  );
}
