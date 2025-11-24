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

  const imageList = [
    cock.image1,
    cock.image2,
    cock.image3,
    cock.image4,
    cock.image5,
  ].filter((img) => img);

  const backend = process.env.NEXT_PUBLIC_BACKEND;
  const path = imageList[current];
  const imageSrc = `${backend}${path.startsWith("/") ? "" : "/"}${path}`;

  function prevSlide() {
    setCurrent((prev) => (prev - 1 + imageList.length) % imageList.length);
  }

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % imageList.length);
  }

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
      <div className="w-full h-[175px]  relative rounded">
        <Image src="/images/templates/template.png"
          alt="template"
          fill
          className="object-cover rounded"/>
      </div>

      {/* Image Slider */}
      <div
        className="relative w-full h-120 mt-1 rounded-lg  overflow-hidden  mb-6"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image src={imageSrc} alt="Cock" fill  style={{objectFit: "cover",objectPosition: "center",transform: "scale(0.95)"}} className="rounded-xl" unoptimized />

        <div className="absolute bottom-6 w-full flex justify-center space-x-2">
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

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
          <span className="text-gray-500 text-sm">Price</span>
          <span className="text-yellow-700 font-bold text-lg">₱{cock.price}</span>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
          <span className="text-gray-500 text-sm">Bloodline</span>
          <span className="text-gray-800 font-semibold">{cock.bloodline}</span>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
          <span className="text-gray-500 text-sm">Age</span>
          <span className="text-gray-800 font-semibold">{cock.age}</span>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
          <span className="text-gray-500 text-sm">Victory count</span>
          <span className="text-gray-800 font-semibold">{cock.victory}</span>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
          <span className="text-gray-500 text-sm">Class Type</span>
          <span className="text-gray-800 font-semibold">{cock.category}</span>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-lg transition">
          <span className="text-gray-500 text-sm">Location</span>
          <span className="text-gray-800 font-semibold">{cock.location}</span>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Order Now</h2>
        <a
          href={`tel:${cock.contact_number}`}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-yellow-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition"
        >
          Call Seller
        </a>
      </div>
    </div>
  );
}
