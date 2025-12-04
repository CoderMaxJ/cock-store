"use client";

import { useState, useRef, useEffect } from "react";

export default function DropDown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full justify-center gap-x-1.5  bg-black  px-3 border border-gray-500 rounded py-2 text-sm font-semibold text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Dropdown Content */}
      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-40 origin-top-right 
          divide-y divide-white/10 rounded-md bg-gray-800 
          shadow-xl ring-1 ring-white/10 animate-scaleIn"
        >
          <div className="py-1">
            <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" href="#">
              Dashboard
            </a>
            </div>
            <div className="py-1">
            <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" href="/pages/post">
              Sell
            </a>
          </div>

          <div className="py-1">
            <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" href="#">
              Manage Post
            </a>
            </div>
            <div className="py-1">
            <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" href="/pages/register">
              Register Account
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
