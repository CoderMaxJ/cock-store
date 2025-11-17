"use client";
import React, {useState, useEffect, useEffectEvent} from "react";
import Image from "next/image";
import {images} from "next/dist/build/webpack/config/blocks/images";
// Sample image data


export default function ImageSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [post,setPost]=useState<any[]>([])
  // Filter images based on search term

  async function getPost(){
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/posts/`,{
          method:"GET",
          credentials:"include"
      });
      if(response.status === 200){
          const images = await response.json()
          setPost(images);
          console.log("images",images);
      }
  }

    useEffect(() => {
        getPost();
    }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Image Gallery</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search images..."
          className="w-full max-w-md p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {post.map((image) => (
      <div key={image.id}>
        <Image src={`${process.env.NEXT_PUBLIC_BACKEND}${image.image1}`}
          alt={image.bloodline}
          width={300}
          height={200}
          className="object-cover rounded"
               unoptimized
        />
      </div>
    ))}

      </div>
    </div>
  );
}
