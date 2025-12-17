"use client";
import { useState,useRef,useEffect } from "react";
interface props {
    Signal:()=> void;
}
export default function CockType({Signal}:props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selected, setSelectedType] = useState("");
  const [saved,SetSave]=useState("");

  // Load initial value
  useEffect(() => {
      if (typeof window !== "undefined") {
         SetSave(localStorage.getItem("category") ||  '');
        if (saved) setSelectedType(saved);
      }
   
  }, []);

  // Save value on change
  useEffect(() => {
    if (selected) {
        if(selected === ""){
            if (typeof window !== "undefined") {
            localStorage.removeItem("category");
            Signal();
            }
        }else{
            if (typeof window !== "undefined") {
            localStorage.setItem("category", selected);
            Signal();
            }
        }
      
    }
  }, [selected]);


  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 hover:bg-white/20"
      >
        {selected || saved}

        <svg
          className={`size-5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 origigit n-top-right divide-y divide-white/10 rounded-md bg-gray-800 shadow-xl ring-1 ring-white/10">
          <div className="py-1">
            <button onClick={() => {setSelectedType("Category");Signal();localStorage.removeItem("category");}} className="block px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              Category
            </button>
            <button onClick={() => setSelectedType("Super")} className="block px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              Super
            </button>
            <button onClick={() => setSelectedType("A")} className="block px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              Class A
            </button>
            <button onClick={() => setSelectedType("B")} className="block px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              Class B
            </button>
            <button onClick={() => setSelectedType("C")} className="block px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              Class C
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
