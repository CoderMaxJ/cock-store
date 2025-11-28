"use client";

import { useState } from "react";
import userToken from "@/app/api/user/token";
import Image from "next/image";

export default function Post() {
  const [files, setFiles] = useState<FileList | null>(null);

  // fields
  const [bloodline, setBloodline] = useState("");
  const [price, setPrice] = useState("");
  const [age, setAge] = useState("");
  const [victory, setVictory] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [ageUnit,setAgeUnit]=useState("Years");
  const [link,setLink]=useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);   // <-- ADDED

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // prevent double submit

    if (!files || files.length === 0) {
      setMessage("Please select at least one image.");
      return;
    }

    const token = userToken();
    if (!token) {
      setMessage("User not authenticated.");
      return;
    }

    setLoading(true);      // <-- START LOADING
    setMessage("Uploading..."); // <-- SHOW UPLOADING MESSAGE

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    // append text fields
    formData.append("bloodline", bloodline);
    formData.append("price", price);
    formData.append("age",` ${age} ${ageUnit}`);
    formData.append("victory", victory);
    formData.append("category", type);
    formData.append("location", location);
    formData.append("spar_link", link);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/upload/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("Your Warrior has been posted.");
        setBloodline("");
        setPrice("");
        setAge("");
        setVictory("");
        setType("Type");
        setLocation("");
        setFiles(null);
      } else {
        const data = await response.json();
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while uploading.");
    }

    setLoading(false);   // <-- STOP LOADING
  };
 const count = files?.length ?? 0;
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black flex flex-col items-center py-10 px-4">
      <div className="w-full h-[175px]  relative rounded">
             <Image src="/images/templates/template.png"
                  alt="template"
                  fill
                  className="object-cover rounded"/>
              
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4"
      >
        {/* Bloodline */}
        <input
          type="text"
          placeholder="Bloodline"
          className="border p-3 rounded-lg"
          value={bloodline}
          onChange={(e) => setBloodline(e.target.value)}
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          className="border p-3 rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {/* AGE SELECT GROUP */}
        <div className="flex gap-3">

          {/* Number Select */}
          <select
            className="flex-1 border p-3 rounded-lg bg-white"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">Age</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          {/* Unit Select */}
          <select
            className="w-28 border p-3 rounded-lg bg-white"
            value={ageUnit}
            onChange={(e) => setAgeUnit(e.target.value)}
          >
            <option value="Years">Year</option>
            <option value="Months">Month</option>
          </select>

        </div>


        {/* Victory */}
        <input
          type="number"
          placeholder="Victory Count"
          className="border p-3 rounded-lg"
          value={victory}
          onChange={(e) => setVictory(e.target.value)}
        />

        {/* Type */}
        <select
          className="border p-3 rounded-lg bg-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Type</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="SUPER">SUPER</option>
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          className="border p-3 rounded-lg"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="url"
          placeholder="Sparring link from facebook"
          className="border p-3 rounded-lg w-full"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        {/* Upload */}
        <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>

          <span className="text-gray-600">Tap to upload images</span>
          <input type="file" multiple onChange={handleFileChange} className="hidden" />
        </label>
        {count > 0 && (
          <p className="text-sm text-gray-600 text-center mt-1">
            {`Selected ${count} image${count > 1 ? "s" : ""}`}
          </p>
        )}
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`p-3 rounded-lg text-white transition 
            ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Uploading..." : "Upload Warrior"}
        </button>

        {message && <p className="text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
