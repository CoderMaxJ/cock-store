"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import userToken from "@/app/api/user/token";

// Swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

export default function CockDetailsPage() {
  const { id } = useParams();
  const [cock, setCock] = useState<any>(null);
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

  // Collect all images safely
  const imageList = [cock.image1, cock.image2, cock.image3, cock.image4].filter(
    (img) => img && img !== "" && img !== null
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      {/* Title */}
      <h1
        className="text-3xl font-extrabold text-center mb-4 bg-gradient-to-r 
           from-yellow-600 via-red-600 to-yellow-600 bg-clip-text 
           text-transparent"
      >
        {cock.bloodline}
      </h1>

      {/* Image Carousel */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-xl shadow-lg mb-4 h-72"
      >
        {imageList.map((image: string, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-72 rounded-xl overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND}${image}`}
                alt={`Cock image ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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

          <p>
            <span className="font-semibold">Bloodline:</span> {cock.bloodline}
          </p>

          <p>
            <span className="font-semibold">Location:</span> {cock.location}
          </p>

          <p>
            <span className="font-semibold">Description:</span>
            <br />
            <span className="block mt-1 text-gray-600">
              {cock.description || "High-quality warrior cock."}
            </span>
          </p>
        </div>
      </div>

      {/* Contact / Order Section */}
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
