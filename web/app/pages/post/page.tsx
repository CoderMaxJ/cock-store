"use client"; // if using Next.js app directory

import { useState } from "react";

export default function Post(){
  const [files, setFiles] = useState<FileList | null>(null);
  const [bloodline, setBloodline] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files) {
      setMessage("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file); // 'images' is the key Django expects
    });
    formData.append("bloodline", bloodline);
    formData.append("price", price);
    try {const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/upload/`, {
      method: "POST",
      body: formData, // formData already handles multipart
      credentials: "include" // send cookies
    });

      if (response.ok) {
        setMessage("Upload successful!");
        setBloodline("");
        setPrice("");
      } else {
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while uploading.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white rounded shadow">
        <input type="text"
          placeholder="Bloodline"
          className="border p-2 rounded"
               value={bloodline}
          onChange={(e) => setBloodline(e.target.value)}
        />
        <input type="text"
          placeholder="Price"
          className="border p-2 rounded"
               value={price}
          onChange={(e) => setPrice(e.target.value)}
        />


        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
