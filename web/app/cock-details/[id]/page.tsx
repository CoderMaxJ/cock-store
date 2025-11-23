"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import userToken from "@/app/api/user/token";

export default function CockDetailsPage() {
  const { id } = useParams();
  const [cock, setCock] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  // Touch swipe states
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const token = userToken();

  async function fetchCock() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/cock-details/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("=======================",data);
      setCock(data);
    }
  }

  useEffect(() => {
    if (id) fetchCock();
  }, [id]);

  if (!cock)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );

  // Build valid image paths
  const imageList = [
    cock.image1,
    cock.image2,
    cock.image3,
    cock.image4,
    cock.image5
  ].filter((img) => img && img !== "" && img !== null);

  const backend = process.env.NEXT_PUBLIC_BACKEND;
  const path = imageList[current];

  // Always guarantee a valid URL → fixes mobile broken images
  const imageSrc = `${backend}${path.startsWith("/") ? "" : "/"}${path}`;
console.log(imageSrc)
function prevSlide() {
  setCurrent((prev) => (prev - 1 + imageList.length) % imageList.length);
}

function nextSlide() {
  setCurrent((prev) => (prev + 1) % imageList.length);
}

  // Touch handlers
  function onTouchStart(e: any) {
    setTouchStart(e.touches[0].clientX);
  }

  function onTouchMove(e: any) {
    setTouchEnd(e.touches[0].clientX);
  }

  function onTouchEnd() {
    const swipeDistance = touchStart - touchEnd;
    if (swipeDistance > 50) nextSlide();
    if (swipeDistance < -50) prevSlide();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <h1
        className="text-3xl font-extrabold text-center mb-4 bg-gradient-to-r 
           from-yellow-600 via-red-600 to-yellow-600 bg-clip-text 
           text-transparent"
      >
        {cock.bloodline}
      </h1>

      {/* Swipeable Image Slider */}
      <div
        className="relative w-full h-72 rounded-xl overflow-hidden shadow-lg mb-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* FIXED IMAGE URL */}
        <Image
          src={imageSrc}
          alt="Cock"
          fill
          style={{ objectFit: "cover" }}
    
        />

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          ‹
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          ›
        </button>

        {/* Dots */}
     <div className="absolute bottom-3 w-full flex justify-center space-x-2">
      {imageList.map((_, i) => (
        <div
          key={i}
          onClick={() => setCurrent(i)}
          className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ${
            current === i ? "bg-white scale-125" : "bg-white/40 scale-100"
          }`}
        ></div>
      ))}
    </div>
      </div>

      {/* Info Box */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Details</h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <span className="font-semibold">Price:</span>{" "}
            <span className="text-yellow-700 font-bold text-lg">
              ₱{cock.price}
            </span>
          </p>

          <p className="font-semibold">
            <span className="font-semibold">Bloodline:</span> {cock.bloodline}
          </p>

          <p>
            <span className="font-semibold">Location:</span> {cock.location}
          </p>

          <p>
            <span className="block mt-1  font-semibold">
             Age: {cock.age}
            </span>
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow p-4 mb-32">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Order Now</h2>

        <a
          href={`tel:${cock.contact_number}`}
          className="block w-full bg-blue-600 hover:bg-yellow-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition"
        >
          Call Seller
        </a>
      </div>
    </div>
  );
}
