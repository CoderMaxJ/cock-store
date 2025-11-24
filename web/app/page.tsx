"use client";

import  { useState, useEffect } from "react";
import Image from "next/image";
import userToken from "./api/user/token";
import { useRouter } from "next/navigation";

export default function CockShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cocks, setCocks] = useState<any[]>([]);
  const [user,setUser]=useState('');

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
      setUser(localStorage.getItem('user') || 'Guest');
      data.forEach((c: any) => {
        initialComments[c.id] = [];
        initialLikes[c.id] = 0;
      });
    }
  }

  useEffect(() => {
    getCocks();
  }, []);

  const filteredCocks = cocks.filter((c) =>
    c.bloodline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function react(id:Number,type:String){
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/react/`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body:JSON.stringify({id:id,type:type})
    });

    if(response.status === 200){
      getCocks();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100  mb-10 m-0 p-0">
      {/* Header (fixed) */}
      <div className="fixed top-0 left-0  h-[258px] right-0 z-50 bg-green-500 backdrop-blur-md p-4 shadow-lg">
       <div className="w-full h-[150px] relative rounded">
        <Image
          src="/images/templates/template.png"
          alt="template"
          fill
          className="object-cover rounded"
        />
      </div>
        <div className="flex  gap-5 mb-2">
         <div className="flex items-center justify-around gap-10 mt-4 w-full border border-gray-300 rounded bg-green-500">
            <input
              type="text"
              placeholder="Search by bloodline..."
              className="w-70 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-ls outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

           <button
              className="flex flex-col items-center p-2 rounded-xl 
                        transition w-20 bg-green-500"
            >
              <div className="p-1 rounded-full bg-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>

              <span className="text-xs font-medium text-white mt-1">{user}</span>
            </button>

          </div>

        </div>
      </div>

      {/* Main Grid */}
      <div className="pt-65 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                      lg:grid-cols-4 xl:grid-cols-5 gap-6">

        {filteredCocks.map((cock) => (
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
                style={{objectFit: "cover"}}
                className="rounded-xl"
                unoptimized
                onClick={()=>router.push(`/cock-details/${cock.id}`)}
              />
            </div>

            {/* Info */}
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {cock.bloodline}
            </h2>

            <p className="text-gray-600 text-sm mb-2">
              Age: {cock.age}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              {cock.victory ? `${cock.victory}x Winner` : null}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Class {cock.category}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Location: {cock.location}
            </p>
            {cock.spar_link && (
              <div className="flex">
                <a
                  href={cock.spar_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg shadow-sm text-gray-700 text-sm font-medium"
                >
                  {/* Play Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                    />
                  </svg>
                  <span>Watch Spar</span>
                </a>
              </div>

             
            )}
              <p className="text-black-500 font-bold text-lg mb-2">
              ₱{cock.price || 100}
            </p>
            {/* Like Buttons */}
            <div className="flex justify-evenly mb-3">
              {/* Heart */}
              <button
                onClick={() =>react(cock.id,'heart')}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                ❤️ {cock.heart}
              </button>

              {/* Chat */}
              <button
                onClick={() =>react(cock.id,'comment')}
                className="flex items-center gap-2 text-red-600 text-xl font-semibold"
              >
                💬
              </button>

              {/* Horn */}
              <button
                onClick={() =>react(cock.id,'like')}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
              </svg>

                 {cock.like}
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
            <div className="flex w-full justify-between">
              <p className="text-gray-600 text-xs mb-2">By: {cock.owner_username}</p>
              <p className="text-gray-600 text-xs mb-2">Posted: {cock.date_posted}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
